-- Create Users Table
CREATE TABLE public.users (
	id serial4 NOT NULL,
	username varchar(50) NOT NULL,
	email varchar(100) NOT NULL,
	password_hash varchar(100) NOT NULL,
	first_name varchar(50) NULL,
	last_name varchar(50) NULL,
	college varchar(100) NULL,
	major varchar(100) NULL,
	bio text NULL,
	profile_picture_url varchar(255) NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);


-- Create Channels Table
CREATE TABLE public.channels (
	id serial4 NOT NULL,
	name varchar(255) NOT NULL,
	description text NULL,
	join_url varchar(255) NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT channels_join_url_key UNIQUE (join_url),
	CONSTRAINT channels_pkey PRIMARY KEY (id)
);


-- Create UsersChannels Table
CREATE TABLE public.userschannels (
	user_id int4 NOT NULL,
	channel_id int4 NOT NULL,
	jointed_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT users_channels_pkey PRIMARY KEY (user_id, channel_id),
	CONSTRAINT users_channels_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id),
	CONSTRAINT users_channels_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);


-- Create Tasks Table
CREATE TABLE public.tasks (
	id serial4 NOT NULL,
	channel_id int4 NOT NULL,
	title varchar(255) NOT NULL,
	description text NULL,
	due_date date NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	status varchar(50) DEFAULT 'todo'::character varying NOT NULL,
	priority int4 DEFAULT 2 NOT NULL,
	assigned_to int4 NULL,
	created_by int4 NOT NULL,
	complete bool NULL,
	CONSTRAINT tasks_pkey PRIMARY KEY (id),
	CONSTRAINT tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id),
	CONSTRAINT tasks_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id),
	CONSTRAINT tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);


-- Create Comments Table
CREATE TABLE public."comments" (
	id serial4 NOT NULL,
	"text" text NOT NULL,
	user_id int4 NULL,
	channel_id int4 NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT comments_pkey PRIMARY KEY (id),
	CONSTRAINT comments_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id),
	CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
