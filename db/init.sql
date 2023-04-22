CREATE TABLE IF NOT EXISTS public.user_table
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    username character varying(20) NOT NULL,
    password character varying(64) NOT NULL,
    CONSTRAINT user_pk PRIMARY KEY (id),
    CONSTRAINT username_pk UNIQUE (username)
)

    TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.role
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(10) NOT NULL,
    CONSTRAINT role_pk PRIMARY KEY (id),
    CONSTRAINT name_pk UNIQUE (name)
)

    TABLESPACE pg_default;

INSERT INTO public.role (id, name) values(gen_random_uuid(), 'USER');
INSERT INTO public.role (id, name) values(gen_random_uuid(), 'ADMIN');

CREATE TABLE IF NOT EXISTS public.user_role
(
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    CONSTRAINT user_fk FOREIGN KEY (user_id)
        REFERENCES public.user_table (id) MATCH SIMPLE,
    CONSTRAINT role_fk FOREIGN KEY (role_id)
        REFERENCES public.role (id) MATCH SIMPLE
)

    TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.trip
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    version integer NOT NULL DEFAULT 0,
    name character varying(32) COLLATE pg_catalog."default" NOT NULL,
    place character varying(32) COLLATE pg_catalog."default" NOT NULL,
    archive boolean DEFAULT false,
    currency character varying(3) NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT trip_pk PRIMARY KEY (id),
    CONSTRAINT user_fk FOREIGN KEY (user_id)
        REFERENCES public.user_table (id) MATCH SIMPLE
)

    TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.person
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(64) COLLATE pg_catalog."default" NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT person_pk PRIMARY KEY (id),
    CONSTRAINT user_fk FOREIGN KEY (user_id)
        REFERENCES public.user_table (id) MATCH SIMPLE
)

    TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.person_trip
(
    person_id uuid NOT NULL,
    trip_id uuid NOT NULL,
    sum NUMERIC(9, 2),
    CONSTRAINT person_fk FOREIGN KEY (person_id)
        REFERENCES public.person (id) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
    CONSTRAINT trip_fk FOREIGN KEY (trip_id)
        REFERENCES public.trip (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

    TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.tag
(
    name character varying(13) COLLATE pg_catalog."default" NOT NULL,
    id uuid NOT NULL,
    CONSTRAINT tag_pk PRIMARY KEY (id),
    CONSTRAINT tag_pk_name UNIQUE (name)
)

    TABLESPACE pg_default;

INSERT INTO public.tag (id, name) values(gen_random_uuid(), 'TRANSPORT');
INSERT INTO public.tag (id, name) values(gen_random_uuid(), 'ENTERTAINMENT');
INSERT INTO public.tag (id, name) values(gen_random_uuid(), 'ACCOMMODATION');
INSERT INTO public.tag (id, name) values(gen_random_uuid(), 'FOOD');

CREATE TABLE IF NOT EXISTS public.activity
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    version integer NOT NULL DEFAULT 0,
    trip_id uuid NOT NULL,
    tag_id uuid,
    name character varying(32) COLLATE pg_catalog."default" NOT NULL,
    date date NOT NULL,
    sum NUMERIC(9, 2) NOT NULL,
    CONSTRAINT activity_pk PRIMARY KEY (id),
    CONSTRAINT trip_fk FOREIGN KEY (trip_id)
        REFERENCES public.trip (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT tag_fk FOREIGN KEY (tag_id)
        REFERENCES public.tag (id) MATCH SIMPLE
)

    TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.record
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    activity_id uuid NOT NULL,
    person_id uuid NOT NULL,
    land_money NUMERIC(9, 2),
    borrow_money NUMERIC(9, 2),
    CONSTRAINT record_pk PRIMARY KEY (id),
    CONSTRAINT activity_fk FOREIGN KEY (activity_id)
        REFERENCES public.activity (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT person_fk FOREIGN KEY (person_id)
        REFERENCES public.person (id) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
)

    TABLESPACE pg_default;

-- DROP TABLE IF EXISTS public.record;
-- DROP TABLE IF EXISTS public.activity;
-- DROP TABLE IF EXISTS public.person_trip;
-- DROP TABLE IF EXISTS public.tag;
-- DROP TABLE IF EXISTS public.trip;
-- DROP TABLE IF EXISTS public.person;
-- DROP TABLE IF EXISTS public.user_table;
-- DROP TABLE IF EXISTS public.role;
-- DROP TABLE IF EXISTS public.user_role;
-- DROP EXTENSION pgcrypto;
