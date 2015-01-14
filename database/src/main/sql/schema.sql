-- object: public.users | type: TABLE --
CREATE TABLE public.users(
	username varchar(50) NOT NULL,
	password varchar(60) NOT NULL,
	enabled boolean NOT NULL,
	default_assessment integer,
	email_flag boolean,
	CONSTRAINT users_pk PRIMARY KEY (username)
)
WITH (OIDS=FALSE);

CREATE TABLE public.authorities(
	username varchar(50) NOT NULL,
	authority varchar(50),
	CONSTRAINT ix_auth_username UNIQUE (username,authority)
)
WITH (OIDS=FALSE);

CREATE TABLE public.observation(
    id serial,
    username varchar(50),
    date timestamp,
    lat decimal,
    lon decimal,
    description varchar(1023),
    CONSTRAINT o_pk PRIMARY KEY (id)
)
WITH (OIDS=FALSE);

CREATE TABLE public.observation_images(
    filename varchar(511),
    image bytea,
    observation_id integer,
    CONSTRAINT oi_pk PRIMARY KEY (filename)
)
WITH (OIDS=FALSE);

CREATE TABLE public.tags(
    id serial,
    tag varchar(511),
    username varchar(50),
    CONSTRAINT ot_pk PRIMARY KEY (id)
)
WITH (OIDS=FALSE);

CREATE TABLE public.observation_tags(
    observation_id integer,
    tag_id integer,
    username varchar(50)
)
WITH (OIDS=FALSE);


ALTER TABLE public.observation_images ADD CONSTRAINT obs_obs_img_fk FOREIGN KEY (observation_id)
REFERENCES public.observation (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE public.observation ADD CONSTRAINT obs_user_fk FOREIGN KEY (username)
REFERENCES public.users (username) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE public.observation_tags ADD CONSTRAINT obs_obs_tag_fk FOREIGN KEY (observation_id)
REFERENCES public.observation (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE public.observation_tags ADD CONSTRAINT obs_tag_tag_fk FOREIGN KEY (tag_id)
REFERENCES public.tags (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE public.observation_tags ADD CONSTRAINT usr_obs_tag_fk FOREIGN KEY (username)
REFERENCES public.users (username) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE public.tags ADD CONSTRAINT usr_tag_fk FOREIGN KEY (username)
REFERENCES public.users (username) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;