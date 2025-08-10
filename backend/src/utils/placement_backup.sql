--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ApplicationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ApplicationStatus" AS ENUM (
    'PENDING',
    'SELECTED',
    'REJECTED'
);


ALTER TYPE public."ApplicationStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Application; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Application" (
    id integer NOT NULL,
    "studentId" integer NOT NULL,
    "companyId" integer NOT NULL,
    status public."ApplicationStatus" DEFAULT 'PENDING'::public."ApplicationStatus" NOT NULL,
    role text
);


ALTER TABLE public."Application" OWNER TO postgres;

--
-- Name: Application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Application_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Application_id_seq" OWNER TO postgres;

--
-- Name: Application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Application_id_seq" OWNED BY public."Application".id;


--
-- Name: Branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Branch" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Branch" OWNER TO postgres;

--
-- Name: Branch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Branch_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Branch_id_seq" OWNER TO postgres;

--
-- Name: Branch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Branch_id_seq" OWNED BY public."Branch".id;


--
-- Name: Company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Company" (
    id integer NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    salary double precision NOT NULL,
    "cgpaCriteria" double precision NOT NULL,
    deadline timestamp(3) without time zone NOT NULL,
    description text,
    "filePath" text,
    password text
);


ALTER TABLE public."Company" OWNER TO postgres;

--
-- Name: CompanyAllowedBranch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CompanyAllowedBranch" (
    id integer NOT NULL,
    "companyId" integer NOT NULL,
    "branchId" integer NOT NULL
);


ALTER TABLE public."CompanyAllowedBranch" OWNER TO postgres;

--
-- Name: CompanyAllowedBranch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CompanyAllowedBranch_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CompanyAllowedBranch_id_seq" OWNER TO postgres;

--
-- Name: CompanyAllowedBranch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CompanyAllowedBranch_id_seq" OWNED BY public."CompanyAllowedBranch".id;


--
-- Name: Company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Company_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Company_id_seq" OWNER TO postgres;

--
-- Name: Company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Company_id_seq" OWNED BY public."Company".id;


--
-- Name: Student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Student" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "branchId" integer NOT NULL,
    cgpa double precision NOT NULL,
    "cvPath" text,
    "aadharPath" text,
    "photoPath" text,
    "ugMarksheetPath" text,
    "xMarksheetPath" text,
    "xiiMarksheetPath" text,
    "XIIPercentage" double precision,
    "XPercentage" double precision,
    "rollNumber" integer,
    "registrationNumber" integer
);


ALTER TABLE public."Student" OWNER TO postgres;

--
-- Name: Student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Student_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Student_id_seq" OWNER TO postgres;

--
-- Name: Student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Student_id_seq" OWNED BY public."Student".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text NOT NULL,
    "companyId" integer
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Application id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Application" ALTER COLUMN id SET DEFAULT nextval('public."Application_id_seq"'::regclass);


--
-- Name: Branch id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Branch" ALTER COLUMN id SET DEFAULT nextval('public."Branch_id_seq"'::regclass);


--
-- Name: Company id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company" ALTER COLUMN id SET DEFAULT nextval('public."Company_id_seq"'::regclass);


--
-- Name: CompanyAllowedBranch id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CompanyAllowedBranch" ALTER COLUMN id SET DEFAULT nextval('public."CompanyAllowedBranch_id_seq"'::regclass);


--
-- Name: Student id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student" ALTER COLUMN id SET DEFAULT nextval('public."Student_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Application; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Application" VALUES (1, 9, 6, 'PENDING', NULL);
INSERT INTO public."Application" VALUES (2, 7, 5, 'PENDING', NULL);
INSERT INTO public."Application" VALUES (3, 7, 4, 'PENDING', NULL);
INSERT INTO public."Application" VALUES (4, 11, 4, 'PENDING', NULL);
INSERT INTO public."Application" VALUES (5, 10, 10, 'PENDING', NULL);
INSERT INTO public."Application" VALUES (6, 10, 4, 'PENDING', NULL);
INSERT INTO public."Application" VALUES (7, 10, 19, 'PENDING', NULL);
INSERT INTO public."Application" VALUES (8, 18, 19, 'PENDING', NULL);
INSERT INTO public."Application" VALUES (9, 10, 25, 'PENDING', NULL);
INSERT INTO public."Application" VALUES (10, 10, 24, 'PENDING', NULL);
INSERT INTO public."Application" VALUES (11, 10, 26, 'PENDING', NULL);
INSERT INTO public."Application" VALUES (12, 10, 22, 'PENDING', 'IT');
INSERT INTO public."Application" VALUES (13, 10, 5, 'PENDING', 'IT');
INSERT INTO public."Application" VALUES (14, 29, 4, 'PENDING', 'IT');
INSERT INTO public."Application" VALUES (15, 29, 24, 'PENDING', 'Data Analyst');
INSERT INTO public."Application" VALUES (16, 29, 11, 'PENDING', 'IT');
INSERT INTO public."Application" VALUES (17, 29, 8, 'PENDING', 'IT');
INSERT INTO public."Application" VALUES (18, 29, 9, 'PENDING', 'IT');
INSERT INTO public."Application" VALUES (19, 29, 26, 'PENDING', 'CORE');


--
-- Data for Name: Branch; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Branch" VALUES (4, 'CSE');
INSERT INTO public."Branch" VALUES (6, 'ECE');
INSERT INTO public."Branch" VALUES (5, 'EEE');
INSERT INTO public."Branch" VALUES (7, 'MECH');
INSERT INTO public."Branch" VALUES (3, 'CIVIL');
INSERT INTO public."Branch" VALUES (2, 'CHEMICAL');
INSERT INTO public."Branch" VALUES (1, 'BIOTECH');
INSERT INTO public."Branch" VALUES (8, 'MME');


--
-- Data for Name: Company; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Company" VALUES (4, 'test', 'IT', 12333, 0, '2025-08-06 12:52:52.67', '', NULL, NULL);
INSERT INTO public."Company" VALUES (5, 'test2', 'IT', 12000000, 0, '2025-08-06 13:44:42.659', '', NULL, NULL);
INSERT INTO public."Company" VALUES (6, 'test3', 'Core', 120000, 0, '2025-08-06 13:52:41.539', '', NULL, NULL);
INSERT INTO public."Company" VALUES (7, 'test4', 'Core', 1700000, 8, '2025-08-06 14:07:21.02', '', NULL, NULL);
INSERT INTO public."Company" VALUES (8, 'test5', 'IT', 122000, 7, '2025-08-07 00:00:00', 'Apply!', NULL, NULL);
INSERT INTO public."Company" VALUES (9, 'test6', 'IT', 1200000, 7.5, '2025-08-07 12:30:00', 'Please Apply!', NULL, NULL);
INSERT INTO public."Company" VALUES (10, 'test6', 'IT', 139023, 7, '2025-08-08 14:30:00', 'Apply', 'companyFile-1754497425467-180660563.pdf', NULL);
INSERT INTO public."Company" VALUES (11, 'test8', 'IT', 19839032, 7, '2025-08-20 18:13:00', 'apply', 'companyFile-1754503803574-29336894.pdf', NULL);
INSERT INTO public."Company" VALUES (12, 'test9', 'IT', 7324, 8, '2025-08-24 18:14:00', 'ds', 'companyFile-1754504097619-927201586.pdf', NULL);
INSERT INTO public."Company" VALUES (13, 'test10', 'IT', 4732432, 7, '2025-08-14 18:25:00', 'tes', 'companyFile-1754504765105-760652482.pdf', NULL);
INSERT INTO public."Company" VALUES (14, 'test11', 'IT', 12324, 7, '2025-08-14 18:25:00', 'tes', 'companyFile-1754504884298-573004698.pdf', NULL);
INSERT INTO public."Company" VALUES (15, 'test12', 'IT', 242, 7, '2025-08-14 18:25:00', 'tes', 'companyFile-1754505144683-1632756.pdf', NULL);
INSERT INTO public."Company" VALUES (16, 'test13', 'it', 424, 7, '2025-08-20 23:33:00', 'yes', 'companyFile-1754505230760-123623079.pdf', NULL);
INSERT INTO public."Company" VALUES (17, 'test14', 'IT', 232, 7, '2025-08-20 23:33:00', 'yes', 'companyFile-1754505505641-361383178.pdf', NULL);
INSERT INTO public."Company" VALUES (18, 'test15', 'IT', 293462, 7, '2025-08-20 23:33:00', 'yes', 'companyFile-1754505643294-580233999.pdf', '123');
INSERT INTO public."Company" VALUES (19, 'test16', 'IT', 739847, 7, '2025-08-20 23:33:00', 'yes', 'companyFile-1754505969868-306308358.pdf', '123');
INSERT INTO public."Company" VALUES (20, 'tets17', 'IT', 8372, 7, '2025-08-08 15:30:00', 'ok', 'companyFile-1754575494689-584221558.pdf', '123');
INSERT INTO public."Company" VALUES (21, 'test18', 'It', 983293, 7, '2025-08-09 04:13:00', 'ok', 'companyFile-1754575828125-282657391.pdf', '123');
INSERT INTO public."Company" VALUES (22, 'test19', 'IT', 984239, 7, '2025-08-08 07:15:00', 'ok', 'companyFile-1754576128179-547996576.pdf', '123');
INSERT INTO public."Company" VALUES (23, 'test20', 'IT', 137, 7, '2025-08-09 08:16:00', 'ok', 'companyFile-1754576185130-218022903.pdf', '123');
INSERT INTO public."Company" VALUES (24, 'test21', 'SDE,Data Analyst', 237927, 7, '2025-08-20 08:20:00', 'Apply', 'companyFile-1754587061863-201811071.pdf', '123');
INSERT INTO public."Company" VALUES (25, 'test22', 'SDE,VLSI Designer', 2423404, 7, '2025-08-20 09:18:00', 'ok', 'companyFile-1754587141027-786557765.pdf', '123');
INSERT INTO public."Company" VALUES (26, 'test23', 'SDE,CORE', 984723894, 7, '2025-08-12 07:22:00', 'sppp', 'companyFile-1754587341313-518324672.pdf', '123');


--
-- Data for Name: CompanyAllowedBranch; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."CompanyAllowedBranch" VALUES (6, 4, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (8, 5, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (18, 8, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (19, 9, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (23, 10, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (28, 11, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (30, 12, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (32, 13, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (34, 14, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (36, 15, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (38, 19, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (42, 20, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (44, 21, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (46, 22, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (48, 23, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (50, 24, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (55, 25, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (60, 26, 4);
INSERT INTO public."CompanyAllowedBranch" VALUES (4, 4, 6);
INSERT INTO public."CompanyAllowedBranch" VALUES (9, 5, 6);
INSERT INTO public."CompanyAllowedBranch" VALUES (15, 8, 6);
INSERT INTO public."CompanyAllowedBranch" VALUES (20, 9, 6);
INSERT INTO public."CompanyAllowedBranch" VALUES (24, 10, 6);
INSERT INTO public."CompanyAllowedBranch" VALUES (27, 11, 6);
INSERT INTO public."CompanyAllowedBranch" VALUES (39, 19, 6);
INSERT INTO public."CompanyAllowedBranch" VALUES (51, 24, 6);
INSERT INTO public."CompanyAllowedBranch" VALUES (56, 25, 6);
INSERT INTO public."CompanyAllowedBranch" VALUES (61, 26, 6);
INSERT INTO public."CompanyAllowedBranch" VALUES (5, 4, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (10, 5, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (12, 7, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (16, 8, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (21, 9, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (26, 10, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (31, 12, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (33, 13, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (35, 14, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (37, 15, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (40, 19, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (43, 20, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (45, 21, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (47, 22, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (49, 23, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (52, 24, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (57, 25, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (62, 26, 5);
INSERT INTO public."CompanyAllowedBranch" VALUES (7, 4, 7);
INSERT INTO public."CompanyAllowedBranch" VALUES (13, 7, 7);
INSERT INTO public."CompanyAllowedBranch" VALUES (17, 8, 7);
INSERT INTO public."CompanyAllowedBranch" VALUES (22, 9, 7);
INSERT INTO public."CompanyAllowedBranch" VALUES (25, 10, 7);
INSERT INTO public."CompanyAllowedBranch" VALUES (29, 11, 7);
INSERT INTO public."CompanyAllowedBranch" VALUES (41, 19, 7);
INSERT INTO public."CompanyAllowedBranch" VALUES (53, 24, 7);
INSERT INTO public."CompanyAllowedBranch" VALUES (58, 25, 7);
INSERT INTO public."CompanyAllowedBranch" VALUES (63, 26, 7);
INSERT INTO public."CompanyAllowedBranch" VALUES (11, 6, 3);
INSERT INTO public."CompanyAllowedBranch" VALUES (14, 7, 3);
INSERT INTO public."CompanyAllowedBranch" VALUES (54, 24, 3);
INSERT INTO public."CompanyAllowedBranch" VALUES (59, 25, 3);
INSERT INTO public."CompanyAllowedBranch" VALUES (64, 26, 3);


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Student" VALUES (7, 'Pranu', '722159@student.nitandhra.ac.in', 4, 8.13, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public."Student" VALUES (8, 'Pranjal', 'pr@gmail.com', 4, 8.11, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public."Student" VALUES (3, 'Pranu Pranjal', 'pranu@gmail.com', 4, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public."Student" VALUES (4, 'Pranu', 'pranupranjal85@gmail.com', 4, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public."Student" VALUES (6, 'Pranu', 'pranupr@gmail.com', 4, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public."Student" VALUES (28, 'Pranu', '722259@student.nitandhra.ac.in', 4, 8.2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 722250, 9222521);
INSERT INTO public."Student" VALUES (10, 'Pranu Pranjal', 'p@gmail.com', 5, 8.11, 'cv-1754759322534-963227039.pdf', 'aadhar-1754759322551-815784711.pdf', 'photo-1754759322543-5731951.jpg', 'ug-marksheet-1754759322554-670125541.pdf', 'x-marksheet-1754759322579-162765661.pdf', 'xii-marksheet-1754759322605-888227031.pdf', 83.8, 94, NULL, NULL);
INSERT INTO public."Student" VALUES (11, 'Pranu Pranjal', 'p1@gmail.con', 7, 8.13, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public."Student" VALUES (29, 'Pranu', '72218@student.nitandhra.ac.in', 7, 8.2, 'cv-1754763151817-171639356.pdf', 'aadhar-1754763139788-230762330.pdf', 'photo-1754763117976-394047813.jpg', 'ug-marksheet-1754763162704-123963400.pdf', 'x-marksheet-1754763139865-30793649.pdf', 'xii-marksheet-1754763139865-412116091.pdf', 88, 94, 72218, 922522);
INSERT INTO public."Student" VALUES (9, 'Pranu', 'pranjal@gmail.com', 3, 8.77, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public."Student" VALUES (18, 'Divyanshu', 'p2@gmail.com', 7, 9, 'cv-1754763760616-616143425.pdf', NULL, NULL, NULL, NULL, NULL, 99, 99, NULL, NULL);
INSERT INTO public."Student" VALUES (30, 'Pranu', '@student.nitandhra.ac.in', 5, 9.5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 522222, 8282827);
INSERT INTO public."Student" VALUES (32, 'Pranu', '722222@student.nitandhra.ac.in', 7, 8.71, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 722222, 9222521);


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."User" VALUES (2, 'T&P', 'pranupranjal4@gmail.com', '$2b$10$/AtSOg4rg0a/u1dcfeTc/OMKGzVDOXQm.QGzLvpxUnexRBZ7FXCVK', 'ADMIN', NULL);
INSERT INTO public."User" VALUES (3, 'Pranu Pranjal', 'pranu@gmail.com', '$2b$10$M5oygXdCRoRb9P2aZTdCOuD5Usm8MK3mL6M9Q.oVHM8nf.ZzE74ou', 'student', NULL);
INSERT INTO public."User" VALUES (1, 'TnP', 'pranupranjal850@gmail.com', '$2b$10$CR.oSnKTQ8qMGhCQKaGUDOaBlqSvXQNaL.qxL16ul.nz8tmwvaFW2', 'admin', NULL);
INSERT INTO public."User" VALUES (4, 'Pranu', 'pranupranjal85@gmail.com', '$2b$10$RgEEH0tna5.3p0LO5hQaD.W/SKdbCxGLXXR1VzXv1UxYX7x37nzVO', 'student', NULL);
INSERT INTO public."User" VALUES (6, 'Pranu', 'pranupr@gmail.com', '$2b$10$YWNXd6exUT1NSyVjDvWEKORO1f0HvJKir96DGw2KThOZji7s3UZbq', 'student', NULL);
INSERT INTO public."User" VALUES (7, 'Pranu', '722159@student.nitandhra.ac.in', '$2b$10$IISzGSLR.spOZVc9VXrOXelmkMtMwxi/54ET9bfRZ.J/whFGH3vpy', 'student', NULL);
INSERT INTO public."User" VALUES (8, 'Pranjal', 'pr@gmail.com', '$2b$10$5cAb59cu7MIJHrRmQIPUKuwcTs0QEtGuN3alxfV2l0FN84V3Frtqa', 'student', NULL);
INSERT INTO public."User" VALUES (9, 'Pranu', 'pranjal@gmail.com', '$2b$10$ZYYGZy0/I1wHA88u7eRBOee9WLulF37wWHSVWKxuBPpG6bUsQzUTu', 'student', NULL);
INSERT INTO public."User" VALUES (10, 'Pranu', 'p@gmail.com', '$2b$10$sU81Qf15Q.NT9VDTcyhuBu8Hy820WCX8JsZx8p7N6Y1xG69OwG7t2', 'student', NULL);
INSERT INTO public."User" VALUES (11, 'Pranu Pranjal', 'p1@gmail.con', '$2b$10$QES77CNGcrTzKh8Rj8N0BegqfJjzZIROAXckc1a4QXYKX9MWlg5nu', 'student', NULL);
INSERT INTO public."User" VALUES (12, 'test15', 'test15@company.nitap', '$2a$10$zo5nNFs5BPFdPZ93uYKPCO7ks1fxf.H9Sy7LW263nS2kwoWbCwFU2', 'company', 18);
INSERT INTO public."User" VALUES (13, 'test16', 'test16@company.nitap', '$2a$10$OGS4AL8x2clXT77NIYb.JeCclPeVyBwYzXU/gF8W.chDI/en6uMk2', 'company', 19);
INSERT INTO public."User" VALUES (14, 'tets17', 'tets17@company.nitap', '$2a$10$.jR7hTgxxLoai2V8TqCKGuFoeQNesPkeOZpWCDU53t0nQhRPckpea', 'company', 20);
INSERT INTO public."User" VALUES (15, 'test18', 'test18@company.nitap', '$2a$10$Czvs6/IJRI3JcQ8rRmAmmOWZyBpXAZUZxQs753xwnKI9OefL702jC', 'company', 21);
INSERT INTO public."User" VALUES (16, 'test19', 'test19@company.nitap', '$2a$10$gsVG17MRjr.v6ykizQzzjeyCd.u.wMjIfNPg4G2T86IAslBgCItAG', 'company', 22);
INSERT INTO public."User" VALUES (17, 'test20', 'test20@company.nitap', '$2a$10$Uu3DHM14iDqGchHzD7MBYOBeVK281VUL/AjD2r87VPJmVLgGUj24K', 'company', 23);
INSERT INTO public."User" VALUES (18, 'Divyanshu', 'p2@gmail.com', '$2b$10$k7X35zsi4iR4U3lczmbIzOcf11q43AFXVQTwOvMCBQjNQm1zbL8hW', 'student', NULL);
INSERT INTO public."User" VALUES (19, 'test21', 'test21@company.nitap', '$2a$10$z9m.qwpzte91xWVzTdEEJu/q3LL3NxaZDSEDsizE547qPXHwZCM2u', 'company', 24);
INSERT INTO public."User" VALUES (20, 'test22', 'test22@company.nitap', '$2a$10$Y1TjFjcn0zpop8kINu.MH.hYUNqT8qaD8CTS5yCDYLHOAy2jlGYx.', 'company', 25);
INSERT INTO public."User" VALUES (21, 'test23', 'test23@company.nitap', '$2a$10$0yVMbT63nGebYes0I7zyI.CYTMCF85OXNlmeoGAwoRlVlOErPMGH2', 'company', 26);
INSERT INTO public."User" VALUES (22, 'Pranu', '722166@student.nitandhra.ac.in', '$2b$10$mu6D/51DTkl2ryObyvTCAuEXVi4D1HwiOVRhS8hkv4vWXTFbLkpa.', 'student', NULL);
INSERT INTO public."User" VALUES (27, 'Pranu Pr', '722167@student.nitandhra.ac.in', '$2b$10$emGLOdWEQgZVF4x26IZbK.7rS.VFMXaU7tDKhw/NtugYScKkvpXNq', 'student', NULL);
INSERT INTO public."User" VALUES (28, 'Pranu', '722259@student.nitandhra.ac.in', '$2b$10$BOnb7qoiSSrff2XbPERXyuGwTABuCPbvUFxM4KDzKYYEogS5EqY16', 'student', NULL);
INSERT INTO public."User" VALUES (29, 'Pranu', '72218@student.nitandhra.ac.in', '$2b$10$sWsAhYvZ0A/Xej.Aere4ruMYjKSIn48PkkzhmBYubvzUbkNqZyt3m', 'student', NULL);
INSERT INTO public."User" VALUES (30, 'Pranu', '@student.nitandhra.ac.in', '$2b$10$jjmDuGKzaRkTbtz/d8Zz4uT7tobMqUKOPUhnx7Tnvzz3qqe2AO0aa', 'student', NULL);
INSERT INTO public."User" VALUES (31, 'Pranu Pranjal', '322219@student.nitandhra.ac.in', '$2b$10$XKq6X2k8LZS1BnI7Ip1/ieme0L5bU80s4AAMjsyV7AQlsHKGnSyM.', 'admin', NULL);
INSERT INTO public."User" VALUES (32, 'Pranu', '722222@student.nitandhra.ac.in', '$2b$10$uShGi8.lVzzfQBZBr0VjjOV0ow5XmD6Z8dAgyTTdZKEi97pIdVHIy', 'student', NULL);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public._prisma_migrations VALUES ('30319d7d-f0ca-44a9-ab26-f88ebae084a8', '37312825ddc91360e81fbc2a0c47025a2279941135a5d368e19d226fc888f46a', '2025-08-06 00:52:42.398899+05:30', '20250805192242_init', NULL, NULL, '2025-08-06 00:52:42.377132+05:30', 1);
INSERT INTO public._prisma_migrations VALUES ('db011720-65df-4905-85a3-aa725bf793c0', 'c93157d1e30d76e3827e33069f1cef528cbf588784f4af5e3b804dfff478daf3', '2025-08-06 16:50:54.22613+05:30', '20250806112054_add_user_model', NULL, NULL, '2025-08-06 16:50:54.209074+05:30', 1);
INSERT INTO public._prisma_migrations VALUES ('ddc0b737-b1ab-4220-9130-2205736b2336', 'ad2cbfed091f350eea4ee61daea1cc969d08dd0cffd7982df0100875ad1b881b', '2025-08-06 21:51:04.100722+05:30', '20250806162104_add_company_file_path', NULL, NULL, '2025-08-06 21:51:04.095768+05:30', 1);
INSERT INTO public._prisma_migrations VALUES ('3ff5356b-53ec-49f4-bc9c-412e520d1535', 'c708e306b40f76e753e82aa8286f3ca65d33755e3a3cd10642c2b84ee41e7847', '2025-08-06 22:14:45.331015+05:30', '20250806164445_add_cv_path_to_student', NULL, NULL, '2025-08-06 22:14:45.327807+05:30', 1);
INSERT INTO public._prisma_migrations VALUES ('553f3f56-027d-459e-9f95-ca5c52f5650a', '3e8e40e02e9f23ddc813506300171204dfcf6b1b9bbbbd3691882c84801758ca', '2025-08-06 22:52:51.943175+05:30', '20250806172251_add_file_paths', NULL, NULL, '2025-08-06 22:52:51.939307+05:30', 1);
INSERT INTO public._prisma_migrations VALUES ('b0b7ba17-6203-4406-9b35-c6bde3b25e42', '0abc300058dd43f394c36a997087686b7d681418ce2bcd75ae4599add63f5f88', '2025-08-06 23:53:59.259316+05:30', '20250806182359_add_user_company_relation', NULL, NULL, '2025-08-06 23:53:59.253748+05:30', 1);
INSERT INTO public._prisma_migrations VALUES ('10889674-9e75-4783-a991-fe5cf00a6c77', 'eeda678f51f72a0f6a810d69b845f1eb546a83690c71d19b92fb9bae56555d38', '2025-08-07 23:10:10.610067+05:30', '20250807174010_add_role_to_application', NULL, NULL, '2025-08-07 23:10:10.599142+05:30', 1);
INSERT INTO public._prisma_migrations VALUES ('e121d907-78ab-401b-b23e-9dd029e5ec49', '9335550204bf71f96122b815a2e49dfad1548752dc95a16f6b1d2176a8a227e5', '2025-08-09 22:22:16.736475+05:30', '20250809165216_add_x_xii_percentage', NULL, NULL, '2025-08-09 22:22:16.731438+05:30', 1);
INSERT INTO public._prisma_migrations VALUES ('0cc5b1f5-ec2f-407d-8717-a4e43ea5e60d', '12b3bdf18a0b4fca0cc917f03e23eb1ac8d2722f9772ac407387f0d7400878bc', '2025-08-09 23:06:36.703905+05:30', '20250809173636_add_roll_registration_number', NULL, NULL, '2025-08-09 23:06:36.697772+05:30', 1);
INSERT INTO public._prisma_migrations VALUES ('bf88b3db-f356-4df6-ae29-7972859fa6b9', 'f2f272e8af4ab64eeacd8de00957600a8df671cbada7338e14e1d80feafdbd86', '2025-08-09 23:16:24.218195+05:30', '20250809174624_fixed_roll_registration_number', NULL, NULL, '2025-08-09 23:16:24.213506+05:30', 1);


--
-- Name: Application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Application_id_seq"', 19, true);


--
-- Name: Branch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Branch_id_seq"', 1, false);


--
-- Name: CompanyAllowedBranch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CompanyAllowedBranch_id_seq"', 64, true);


--
-- Name: Company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Company_id_seq"', 26, true);


--
-- Name: Student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Student_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 32, true);


--
-- Name: Application Application_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT "Application_pkey" PRIMARY KEY (id);


--
-- Name: Branch Branch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_pkey" PRIMARY KEY (id);


--
-- Name: CompanyAllowedBranch CompanyAllowedBranch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CompanyAllowedBranch"
    ADD CONSTRAINT "CompanyAllowedBranch_pkey" PRIMARY KEY (id);


--
-- Name: Company Company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_pkey" PRIMARY KEY (id);


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Application_studentId_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Application_studentId_companyId_key" ON public."Application" USING btree ("studentId", "companyId");


--
-- Name: Branch_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Branch_name_key" ON public."Branch" USING btree (name);


--
-- Name: CompanyAllowedBranch_companyId_branchId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CompanyAllowedBranch_companyId_branchId_key" ON public."CompanyAllowedBranch" USING btree ("companyId", "branchId");


--
-- Name: Student_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Student_email_key" ON public."Student" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Application Application_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Application Application_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT "Application_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CompanyAllowedBranch CompanyAllowedBranch_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CompanyAllowedBranch"
    ADD CONSTRAINT "CompanyAllowedBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CompanyAllowedBranch CompanyAllowedBranch_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CompanyAllowedBranch"
    ADD CONSTRAINT "CompanyAllowedBranch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Student Student_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

