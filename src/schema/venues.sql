/*
* @Author: Aman Priyadarshi
* @Date:   2017-03-15 23:39:17
* @Last Modified by:   Ayush Garg
* @Last Modified time: 2017-03-25 23:12:38
*/

CREATE TABLE IF NOT EXISTS Venues
(
	id INTEGER primary key NOT NULL,
	name VARCHAR,
	longitude NUMERIC,
	latitude NUMERIC,
	city VARCHAR,
	country VARCHAR,
	address VARCHAR
);
