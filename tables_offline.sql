CREATE TABLE user_information (
	invitation_id INT UNSIGNED PRIMARY KEY,
	first_name VARCHAR(64) NOT NULL UNIQUE,
	last_name VARCHAR(64) NOT NULL UNIQUE,
	contact VARCHAR(255) NOT NULL,
	other_info VARCHAR(255) DEFAULT NULL,
	FOREIGN KEY (invitation_id) REFERENCES invitations(id)
);