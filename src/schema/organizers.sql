/*
* @Author: Aman Priyadarshi
* @Date:   2017-03-15 23:38:39
* @Last Modified by:   amaneureka
* @Last Modified time: 2017-04-03 16:44:13
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
