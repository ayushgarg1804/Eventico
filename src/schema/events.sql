/*
* @Author: Aman Priyadarshi
* @Date:   2017-03-15 23:12:45
* @Last Modified by:   Aman Priyadarshi
* @Last Modified time: 2017-03-15 23:42:30
*/

CREATE TABLE IF NOT EXISTS Events
(
	id INTEGER primary key,
	name VARCHAR,
	created DATETIME,
	status INTEGER,
	start_local DATETIME,
	start_utc DATETIME,
	end_local DATETIME,
	end_utc DATETIME,
	description VARCHAR,
	category_id INTEGER,
	logo_path VARCHAR,
	venue_id INTEGER,
	online_event INTEGER,
	organizer_id INTEGER,
	foreign key(venue_id) references Venues(id),
	foreign key(category_id) references Categories(id),
	foreign key(organizer_id) references Organizers(id)
);