SELECT
	MQ.Ministry_Question_ID,
	MQ.Question_Header,
	MQ.Question_Title,
	MQ.Question_Description,
	MQ.Answer_Label,
	MQ.Answer_Format,
	QS.Question_Section,
	QC.Question_Category,
	JSON_QUERY((
		SELECT
			FA.Fiscal_Period_ID,
			CONVERT(varchar, FP.Fiscal_Period_Start, 126) + 'Z' AS Fiscal_Period_Start,  -- Format date as ISO 8601 and append Z
			SUM(FA.Numerical_Value) AS Period_Total,
			JSON_QUERY((
				SELECT
					SUM(FA2.Numerical_Value) AS Numerical_Value,
					C.Congregation_Name
				FROM Fiscal_Period_Answers FA2
				LEFT JOIN Congregations C ON C.Congregation_ID = FA2.Congregation_ID
				WHERE FA2.Ministry_Question_ID = @QuestionID AND FA2.Fiscal_Period_ID = FA.Fiscal_Period_ID
				GROUP BY C.Congregation_Name
				FOR JSON PATH, INCLUDE_NULL_VALUES
			)) AS Period_Breakdown
		FROM Fiscal_Period_Answers FA
		LEFT JOIN Ministry_Questions MQ ON MQ.Ministry_Question_ID = FA.Ministry_Question_ID
		LEFT JOIN Fiscal_Periods FP ON FP.Fiscal_Period_ID = FA.Fiscal_Period_ID
		WHERE FA.Ministry_Question_ID = @QuestionID
		GROUP BY FA.Fiscal_Period_ID, FP.Fiscal_Period_Start
		ORDER BY FA.Fiscal_Period_ID
		FOR JSON PATH, INCLUDE_NULL_VALUES
	)) AS Question_Answers
FROM Ministry_Questions MQ
LEFT JOIN Question_Sections QS ON QS.Question_Section_ID = MQ.Question_Section_ID
LEFT JOIN Question_Categories QC ON QC.Question_Category_ID = MQ.Question_Category_ID
WHERE MQ.Ministry_Question_ID = @QuestionID