DO
$$
BEGIN
	IF register_patch('CountryNamesConsistencyAndUserAutonomy.sql', 'jekabskarklins', 'Updating and Expanding Country Selection for Enhanced Consistency and User Autonomy', '2024-01-13') THEN
	BEGIN

		INSERT INTO countries (country) VALUES ('Åland Islands');
		INSERT INTO countries (country) VALUES ('American Samoa');
		INSERT INTO countries (country) VALUES ('Antarctica');
		INSERT INTO countries (country) VALUES ('Aruba');
		INSERT INTO countries (country) VALUES ('Bouvet Island');
		INSERT INTO countries (country) VALUES ('British Indian Ocean Territory');
		INSERT INTO countries (country) VALUES ('Caribbean Netherlands');
		INSERT INTO countries (country) VALUES ('Christmas Island');
		INSERT INTO countries (country) VALUES ('Cocos (Keeling) Islands');
		INSERT INTO countries (country) VALUES ('Cook Islands');
		INSERT INTO countries (country) VALUES ('Curaçao');
		INSERT INTO countries (country) VALUES ('Falkland Islands');
		INSERT INTO countries (country) VALUES ('Faroe Islands');
		INSERT INTO countries (country) VALUES ('French Polynesia');
		INSERT INTO countries (country) VALUES ('French Southern and Antarctic Lands');
		INSERT INTO countries (country) VALUES ('Gibraltar');
		INSERT INTO countries (country) VALUES ('Greenland');
		INSERT INTO countries (country) VALUES ('Guam');
		INSERT INTO countries (country) VALUES ('Guernsey');
		INSERT INTO countries (country) VALUES ('Heard Island and McDonald Islands');
		INSERT INTO countries (country) VALUES ('Ireland');
		INSERT INTO countries (country) VALUES ('Isle of Man');
		INSERT INTO countries (country) VALUES ('Jersey');
		INSERT INTO countries (country) VALUES ('Kiribati');
		INSERT INTO countries (country) VALUES ('Macau');
		INSERT INTO countries (country) VALUES ('Marshall Islands');
		INSERT INTO countries (country) VALUES ('Micronesia');
		INSERT INTO countries (country) VALUES ('Nauru');
		INSERT INTO countries (country) VALUES ('New Caledonia');
		INSERT INTO countries (country) VALUES ('Niue');
		INSERT INTO countries (country) VALUES ('Norfolk Island');
		INSERT INTO countries (country) VALUES ('Northern Mariana Islands');
		INSERT INTO countries (country) VALUES ('Palau');
		INSERT INTO countries (country) VALUES ('Palestine');
		INSERT INTO countries (country) VALUES ('Pitcairn Islands');
		INSERT INTO countries (country) VALUES ('Saint Barthélemy');
		INSERT INTO countries (country) VALUES ('Saint Helena, Ascension and Tristan da Cunha');
		INSERT INTO countries (country) VALUES ('Saint Martin');
		INSERT INTO countries (country) VALUES ('Sint Maarten');
		INSERT INTO countries (country) VALUES ('South Georgia');
		INSERT INTO countries (country) VALUES ('Saint Pierre and Miquelon');
		INSERT INTO countries (country) VALUES ('San Marino');
		INSERT INTO countries (country) VALUES ('Svalbard and Jan Mayen');
		INSERT INTO countries (country) VALUES ('Taiwan');
		INSERT INTO countries (country) VALUES ('Tokelau');
		INSERT INTO countries (country) VALUES ('Tonga');
		INSERT INTO countries (country) VALUES ('Tuvalu');
		INSERT INTO countries (country) VALUES ('United States Minor Outlying Islands');
		INSERT INTO countries (country) VALUES ('Vanuatu');
		INSERT INTO countries (country) VALUES ('Vatican City');
		INSERT INTO countries (country) VALUES ('Wallis and Futuna');
		INSERT INTO countries (country) VALUES ('Western Sahara');

		UPDATE countries SET country = 'Antigua and Barbuda' WHERE country = 'Antigua & Barbuda';
		UPDATE countries SET country = 'Bosnia and Herzegovina' WHERE country = 'Bosnia & Herzegovina';
		UPDATE countries SET country = 'British Virgin Islands' WHERE country = 'Virgin Islands (UK)';
		UPDATE countries SET country = 'Brunei' WHERE country = 'Brunei Darussalam';
		UPDATE countries SET country = 'Republic of the Congo' WHERE country = 'Congo';
		UPDATE countries SET country = 'DR Congo' WHERE country = 'Congo, Democratic Republic of (DRC)';
		UPDATE countries SET country = 'Czechia' WHERE country = 'Czech Republic';
		UPDATE countries SET country = 'Gambia' WHERE country = 'Gambia, Republic of The';
		UPDATE countries SET country = 'United Kingdom' WHERE country = 'Great Britain';
		UPDATE countries SET country = 'Israel' WHERE country = 'Israel and the Occupied Territories';
		UPDATE countries SET country = 'North Korea' WHERE country = 'Korea, Democratic Republic of (North Korea)';
		UPDATE countries SET country = 'South Korea' WHERE country = 'Korea, Republic of (South Korea)';
		UPDATE countries SET country = 'Timor-Leste' WHERE country = 'Timor Leste';
		UPDATE countries SET country = 'Trinidad and Tobago' WHERE country = 'Trinidad & Tobago';
		UPDATE countries SET country = 'Turks and Caicos Islands' WHERE country = 'Turks & Caicos Islands';
		UPDATE countries SET country = 'United States' WHERE country = 'United States of America (USA)';
		UPDATE countries SET country = 'Kyrgyzstan' WHERE country = 'Kyrgyz Republic (Kyrgyzstan)';
		UPDATE countries SET country = 'Moldova' WHERE country = 'Moldova, Republic of';
		UPDATE countries SET country = 'Myanmar' WHERE country = 'Myanmar/Burma';
		UPDATE countries SET country = 'North Macedonia' WHERE country = 'North Macedonia, Republic of';
		UPDATE countries SET country = 'Réunion' WHERE country = 'Reunion';
		UPDATE countries SET country = 'São Tomé and Príncipe' WHERE country = 'Sao Tome and Principe';
		UPDATE countries SET country = 'Slovakia' WHERE country = 'Slovak Republic (Slovakia)';
		UPDATE countries SET country = 'Turks and Caicos Islands' WHERE country = 'Turks & Caicos Islands';
		UPDATE countries SET country = 'United States Virgin Islands' WHERE country = 'Virgin Islands (US)';
		UPDATE countries SET country = 'Hong Kong' WHERE country = 'China - Hong Kong / Macau';
		UPDATE countries SET country = 'Russia' WHERE country = 'Russian Federation';
		UPDATE countries SET country = 'São Tomé and Príncipe' WHERE country = 'São Tomé and Príncipe';

	END;
	END IF;
END;
$$
LANGUAGE plpgsql;