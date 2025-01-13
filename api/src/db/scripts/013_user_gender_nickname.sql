DROP PROCEDURE IF EXISTS user_gender_nickname;

CREATE PROCEDURE user_gender_nickname()
BEGIN
	IF NOT EXISTS (
		SELECT 1 
		FROM information_schema.columns 
		WHERE table_name='user'
		AND column_name='gender'
	) THEN
		ALTER TABLE user ADD COLUMN gender ENUM('male', 'female', 'other') NULL AFTER providerId;
		ALTER TABLE user ADD COLUMN nickname VARCHAR(50) NULL AFTER providerId;
	END IF;
END;

CALL user_gender_nickname();

DROP PROCEDURE user_gender_nickname;