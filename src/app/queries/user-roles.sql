SELECT
    COALESCE((
        SELECT
            Role_Name,
            R.Role_ID
        FROM dp_Users U
        LEFT JOIN dp_User_Roles UR ON UR.User_ID = U.User_ID
        LEFT JOIN dp_Roles R ON R.Role_ID = UR.Role_ID
        WHERE U.User_GUID = @sub
        FOR JSON PATH
    ), '[]') AS Roles,
    COALESCE((
        SELECT
            UG.User_Group_Name,
            UUG.User_Group_ID
        FROM dp_Users U
        LEFT JOIN dp_User_User_Groups UUG ON UUG.User_ID = U.User_ID
        LEFT JOIN dp_User_Groups UG ON UG.User_Group_ID = UUG.User_Group_ID
        WHERE U.User_GUID = @sub
        FOR JSON PATH
    ), '[]') AS User_Groups