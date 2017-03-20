/*
* @Author: Aman Priyadarshi
* @Date:   2017-03-15 23:38:39
* @Last Modified by:   Aman Priyadarshi
* @Last Modified time: 2017-03-15 23:38:41
*/

CREATE TABLE IF NOT EXISTS Organizers
(
	id INTEGER primary key,
	description VARCHAR,
	url VARCHAR,
	name VARCHAR,
	logo VARCHAR,
	long_description VARCHAR
);