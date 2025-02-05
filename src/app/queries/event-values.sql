DECLARE @Default_Location_ID INT = 1;
DECLARE @Default_Primary_Contact_ID INT = 1296;
DECLARE @Default_Event_Type_ID INT = 2;
DECLARE @Default_Congregation_ID INT = 1;

SELECT '[' + 
    STUFF((
        SELECT ',' + '{' +
            '"Name":"Congregation",' +
            '"Sort_Order":4,' +
            '"Default_ID":' + CAST(@Default_Congregation_ID AS VARCHAR) + ',' +
            '"Labels":[' + STUFF((
                SELECT ',"' + Congregation_Name + '"'
                FROM Congregations
                WHERE End_Date IS NULL OR GETDATE() < End_Date
                FOR XML PATH('')
            ), 1, 1, '') + '],' +
            '"Values":[' + STUFF((
                SELECT ',' + CAST(Congregation_ID AS VARCHAR)
                FROM Congregations
                WHERE End_Date IS NULL OR GETDATE() < End_Date
                FOR XML PATH('')
            ), 1, 1, '') + ']' +
        '}' +

        ',' + '{' +
            '"Name":"Location",' +
            '"Sort_Order":1,' +
            '"Default_ID":' + CAST(@Default_Location_ID AS VARCHAR) + ',' +
            '"Labels":[' + STUFF((
                SELECT ',"' + Location_Name + '"'
                FROM Locations
                WHERE Move_Out_Date IS NULL OR GETDATE() < Move_Out_Date
                FOR XML PATH('')
            ), 1, 1, '') + '],' +
            '"Values":[' + STUFF((
                SELECT ',' + CAST(Location_ID AS VARCHAR)
                FROM Locations
                WHERE Move_Out_Date IS NULL OR GETDATE() < Move_Out_Date
                FOR XML PATH('')
            ), 1, 1, '') + ']' +
        '}' +

        ',' + '{' +
            '"Name":"Primary Contact",' +
            '"Sort_Order":2,' +
            '"Default_ID":' + CAST(@Default_Primary_Contact_ID AS VARCHAR) + ',' +
            '"Labels":[' + STUFF((
                SELECT ',"' + C.Nickname + ' ' + C.Last_Name + '"'
                FROM dp_User_User_Groups UG
                LEFT JOIN Contacts C ON C.User_Account = UG.User_ID
                WHERE User_Group_ID = 76
                FOR XML PATH('')
            ), 1, 1, '') + '],' +
            '"Values":[' + STUFF((
                SELECT ',' + CAST(C.Contact_ID AS VARCHAR)
                FROM dp_User_User_Groups UG
                LEFT JOIN Contacts C ON C.User_Account = UG.User_ID
                WHERE User_Group_ID = 76
                FOR XML PATH('')
            ), 1, 1, '') + ']' +
        '}' +

        ',' + '{' +
            '"Name":"Event Type",' +
            '"Sort_Order":3,' +
            '"Default_ID":' + CAST(@Default_Event_Type_ID AS VARCHAR) + ',' +
            '"Labels":[' + STUFF((
                SELECT ',"' + Event_Type + '"'
                FROM Event_Types
                WHERE End_Date IS NULL OR GETDATE() < End_Date
                FOR XML PATH('')
            ), 1, 1, '') + '],' +
            '"Values":[' + STUFF((
                SELECT ',' + CAST(Event_Type_ID AS VARCHAR)
                FROM Event_Types
                WHERE End_Date IS NULL OR GETDATE() < End_Date
                FOR XML PATH('')
            ), 1, 1, '') + ']' +
        '}' 
    FOR XML PATH('')), 1, 1, '') + 
']' AS Options