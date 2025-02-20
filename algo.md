code should effectively handle both scenarios of registering the user for the first time
and updating the existing but unverified user with a new password and verificaiton code

IF EXISTING_USER_BY_EMAIL EXISTS THEN 

    IF existingUserByEmail.isVerified() THEN
        SUCCESS: FALSE
    ELSE 
        // save the updated user with given datas by user
    END IF

    ELSE 
        // create a new user with provided details
        // save the new user
    END IF