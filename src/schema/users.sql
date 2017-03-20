/*
* @Author: Ayush Garg
* @Date:   2017-03-21 00:35:35
* @Last Modified by:   Ayush Garg
* @Last Modified time: 2017-03-21 00:43:21
*/

CREATE TABLE IF NOT EXISTS Users
(
	uid INT primary key,
	username VARCHAR,
	password VARCHAR,
	email VARCHAR,
	full_name VARCHAR
);