DECLARE @PeriodID INT = (SELECT Fiscal_Period_ID FROM Fiscal_Periods FP WHERE YEAR(FP.Fiscal_Period_Start) = @Year AND MONTH(FP.Fiscal_Period_Start) = @Month)

SELECT
  QS.Question_Section_ID,
  QS.Question_Section,
  (
    SELECT
      QC.Question_Category_ID,
      QC.Question_Category,
      JSON_QUERY((
        SELECT
          MQ.Ministry_Question_ID,
          MQ.Question_Header,
          MQ.Question_Title,
          MQ.Question_Description,
          MQ.Answer_Format,
          MQ.Answer_Label,
					(SELECT SUM(PA.Numerical_Value) FROM Fiscal_Period_Answers PA WHERE PA.Ministry_Question_ID = MQ.Ministry_Question_ID AND (@CongregationID = 0 OR PA.Congregation_ID = @CongregationID) AND PA.Fiscal_Period_ID = @PeriodID) AS Current_Total,
					(SELECT SUM(PA.Numerical_Value) FROM Fiscal_Period_Answers PA WHERE PA.Ministry_Question_ID = MQ.Ministry_Question_ID AND (@CongregationID = 0 OR PA.Congregation_ID = @CongregationID) AND PA.Fiscal_Period_ID = (@PeriodID - 12)) AS Previous_Total,
					@Year AS Current_Year,
					(@Year - 1) AS Previous_Year
        FROM Ministry_Questions MQ
        WHERE 
          MQ.Question_Section_ID = QS.Question_Section_ID 
          AND MQ.Question_Category_ID = QC.Question_Category_ID
          AND MQ.Discontinued = 0
          ORDER BY MQ.Answer_Order
        FOR JSON PATH, INCLUDE_NULL_VALUES
      )) AS Question_Data
    FROM Question_Categories QC
    WHERE QC.Question_Section_ID = QS.Question_Section_ID
    FOR JSON PATH
  ) AS Questions
FROM Question_Sections QS
WHERE QS.Active = 1
ORDER BY QS.[Order];