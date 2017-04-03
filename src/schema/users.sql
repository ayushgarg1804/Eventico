/*
* @Author: Ayush Garg
* @Date:   2017-03-21 00:35:35
* @Last Modified by:   amaneureka
* @Last Modified time: 2017-04-03 16:44:20
*/

CREATE TABLE IF NOT EXISTS Users
(
	uid INTEGER primary key NOT NULL,
	username VARCHAR,
	password VARCHAR,
	email VARCHAR,
	full_name VARCHAR
);
