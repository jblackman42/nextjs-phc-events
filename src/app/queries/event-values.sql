SELECT
	(SELECT '[' + STUFF((
		SELECT ',' + '{"Location_ID":' + CAST(Location_ID AS VARCHAR) + 
		',"Location_Name":"' + Location_Name + '"}'
		FROM Locations 
		WHERE Move_Out_Date IS NULL OR GETDATE() < Move_Out_Date
		FOR XML PATH('')), 1, 1, '') + ']') AS Locations,

	(SELECT '[' + STUFF((
		SELECT ',' + '{"Contact_ID":' + CAST(C.Contact_ID AS VARCHAR) + 
		',"Nickname":"' + ISNULL(C.Nickname, '') + 
		'","First_Name":"' + ISNULL(C.First_Name, '') + 
		'","Last_Name":"' + ISNULL(C.Last_Name, '') + '"}'
		FROM dp_User_User_Groups UG
		LEFT JOIN Contacts C ON C.User_Account = UG.User_ID
		WHERE User_Group_ID = 76
		FOR XML PATH('')), 1, 1, '') + ']') AS Primary_Contacts,

	(SELECT '[' + STUFF((
		SELECT ',' + '{"Event_Type_ID":' + CAST(Event_Type_ID AS VARCHAR) + 
		',"Event_Type":"' + Event_Type + 
		'","Description":"' + ISNULL(Description, '') + '"}'
		FROM Event_Types
		WHERE End_Date IS NULL OR GETDATE() < End_Date
		FOR XML PATH('')), 1, 1, '') + ']') AS Event_Types,

	(SELECT '[' + STUFF((
		SELECT ',' + '{"Congregation_ID":' + CAST(Congregation_ID AS VARCHAR) + 
		',"Congregation_Name":"' + Congregation_Name + 
		'","Description":"' + ISNULL(Description, '') + '"}'
		FROM Congregations
		WHERE End_Date IS NULL OR GETDATE() < End_Date
		FOR XML PATH('')), 1, 1, '') + ']') AS Congregations