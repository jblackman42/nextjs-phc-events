SELECT
    E.Equipment_ID,
    E.Equipment_Name,
    E.Date_Acquired,
    E.Equipment_Type_ID,
    ET.Equipment_Type,
    E.Quantity
FROM Equipment E
LEFT JOIN Equipment_Types ET ON ET.Equipment_Type_ID = E.Equipment_Type_ID
WHERE
    E.Bookable = 1
    AND (E.Date_Retired IS NULL OR GETDATE() < E.Date_Retired)
ORDER BY
    E.Equipment_Type_ID