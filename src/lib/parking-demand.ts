export type DemandSource = {
	label: string;
	note: string;
};

export type ParkingDemandPoint = {
	day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
	time: '8 AM' | '9 AM' | '10 AM' | '11 AM' | '1 PM' | '2 PM' | '3 PM';
	academicSources: string;
	academicEstimate: number;
	clinicSources: string;
	clinicEstimate: string;
	totalMin: number;
	totalMax: number;
};

export const demandMethod =
	'Academic classes are counted at 28 students per cohort when the schedule places that cohort in class or lab at that time. Split labs are counted as 28 for parking pressure when they create likely transition overlap. NSU clinic counts are added only when the faculty clinic schedule assigns students or residents to NSU-based clinic activity. CNOHC, off-site, OD-only, duty doc, and on-call assignments are excluded.';

export const demandSources: DemandSource[] = [
	{
		label: 'Spring 2026 class schedule',
		note: 'Source for OPT I, OPT II, and OPT III academic class and lab blocks.'
	},
	{
		label: 'Spring 2026 faculty clinic schedule',
		note: 'Source for AM and PM NSU-based clinic student and resident assignments.'
	}
];

export const demandDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
export const demandTimes = ['8 AM', '9 AM', '10 AM', '11 AM', '1 PM', '2 PM', '3 PM'] as const;

export const parkingDemand: ParkingDemandPoint[] = [
	{
		day: 'Monday',
		time: '8 AM',
		academicSources: 'None counted; OPT III clinic block not included',
		academicEstimate: 0,
		clinicSources: 'IV OS4 3 + Dry Eye OS4 3',
		clinicEstimate: '6',
		totalMin: 6,
		totalMax: 6
	},
	{
		day: 'Monday',
		time: '9 AM',
		academicSources: 'OPT I Neuro + OPT II CL II',
		academicEstimate: 56,
		clinicSources: 'IV OS4 3 + Dry Eye OS4 3',
		clinicEstimate: '6',
		totalMin: 62,
		totalMax: 62
	},
	{
		day: 'Monday',
		time: '10 AM',
		academicSources: 'OPT I Methods II + OPT II Vision Science III',
		academicEstimate: 56,
		clinicSources: 'IV OS4 3 + Dry Eye OS4 3',
		clinicEstimate: '6',
		totalMin: 62,
		totalMax: 62
	},
	{
		day: 'Monday',
		time: '11 AM',
		academicSources: 'OPT I Vision Science I + OPT II Ophthalmic Optics II',
		academicEstimate: 56,
		clinicSources: 'IV OS4 3 + Dry Eye OS4 3',
		clinicEstimate: '6',
		totalMin: 62,
		totalMax: 62
	},
	{
		day: 'Monday',
		time: '1 PM',
		academicSources: 'OPT I Optics/A&P Labs + OPT II Ocular Pharmacology; OPT III clinic block not included',
		academicEstimate: 56,
		clinicSources: 'CL OS4/OS3/Resident 8 + Laser/Refractive 5 + Low Vision 3',
		clinicEstimate: '16',
		totalMin: 72,
		totalMax: 72
	},
	{
		day: 'Monday',
		time: '2 PM',
		academicSources: 'OPT I Vision Science I + OPT II Pediatrics + OPT III Strab/Amblyopia',
		academicEstimate: 84,
		clinicSources: 'CL OS4/OS3/Resident 8 + Laser/Refractive 5 + Low Vision 3',
		clinicEstimate: '16',
		totalMin: 100,
		totalMax: 100
	},
	{
		day: 'Monday',
		time: '3 PM',
		academicSources: 'OPT I Optics/A&P Labs + OPT II Ocular Disease II + OPT III Practice Development I',
		academicEstimate: 84,
		clinicSources: 'CL OS4/OS3/Resident 8 + Laser/Refractive 5 + Low Vision 3',
		clinicEstimate: '16',
		totalMin: 100,
		totalMax: 100
	},
	{
		day: 'Tuesday',
		time: '8 AM',
		academicSources: 'OPT I Methods II Lab I + OPT II Research Methods',
		academicEstimate: 56,
		clinicSources: 'IV OS4 3 + OD Surgery OS4 3',
		clinicEstimate: '6',
		totalMin: 62,
		totalMax: 62
	},
	{
		day: 'Tuesday',
		time: '9 AM',
		academicSources: 'OPT II Pediatrics',
		academicEstimate: 28,
		clinicSources: 'IV OS4 3 + OD Surgery OS4 3',
		clinicEstimate: '6',
		totalMin: 34,
		totalMax: 34
	},
	{
		day: 'Tuesday',
		time: '10 AM',
		academicSources: 'OPT I Methods II Lab II + OPT II Vision Science III + OPT III Optometric Project III',
		academicEstimate: 84,
		clinicSources: 'IV OS4 3 + OD Surgery OS4 3',
		clinicEstimate: '6',
		totalMin: 90,
		totalMax: 90
	},
	{
		day: 'Tuesday',
		time: '11 AM',
		academicSources: 'OPT I Communication + OPT II Ophthalmic Optics II',
		academicEstimate: 56,
		clinicSources: 'IV OS4 3 + OD Surgery OS4 3',
		clinicEstimate: '6',
		totalMin: 62,
		totalMax: 62
	},
	{
		day: 'Tuesday',
		time: '1 PM',
		academicSources: 'OPT I General Pharmacology + OPT II CL II Lab I; OPT III clinic block not included',
		academicEstimate: 56,
		clinicSources: 'APC 3-4 + CL 4 + OD Surgery 3 + VT 7-8',
		clinicEstimate: '17-19',
		totalMin: 73,
		totalMax: 75
	},
	{
		day: 'Tuesday',
		time: '2 PM',
		academicSources: 'OPT I General Pathology + OPT III Strab/Amblyopia',
		academicEstimate: 56,
		clinicSources: 'APC 3-4 + CL 4 + OD Surgery 3 + VT 7-8',
		clinicEstimate: '17-19',
		totalMin: 73,
		totalMax: 75
	},
	{
		day: 'Tuesday',
		time: '3 PM',
		academicSources: 'OPT II CL II Lab II + OPT III Ocular Disease IV',
		academicEstimate: 56,
		clinicSources: 'APC 3-4 + CL 4 + OD Surgery 3 + VT 7-8',
		clinicEstimate: '17-19',
		totalMin: 73,
		totalMax: 75
	},
	{
		day: 'Wednesday',
		time: '8 AM',
		academicSources: 'OPT II Vision Science III + OPT III Methods IV',
		academicEstimate: 56,
		clinicSources: 'Laser Clinic OS4 3',
		clinicEstimate: '3',
		totalMin: 59,
		totalMax: 59
	},
	{
		day: 'Wednesday',
		time: '9 AM',
		academicSources: 'OPT I General Pharmacology + OPT II CL II',
		academicEstimate: 56,
		clinicSources: 'Laser Clinic OS4 3',
		clinicEstimate: '3',
		totalMin: 59,
		totalMax: 59
	},
	{
		day: 'Wednesday',
		time: '10 AM',
		academicSources: 'OPT I Ocular Anatomy + OPT II Pediatrics',
		academicEstimate: 56,
		clinicSources: 'Laser Clinic OS4 3',
		clinicEstimate: '3',
		totalMin: 59,
		totalMax: 59
	},
	{
		day: 'Wednesday',
		time: '11 AM',
		academicSources: 'OPT II Ocular Pharmacology',
		academicEstimate: 28,
		clinicSources: 'Laser Clinic OS4 3',
		clinicEstimate: '3',
		totalMin: 31,
		totalMax: 31
	},
	{
		day: 'Wednesday',
		time: '1 PM',
		academicSources: 'OPT I General Pharmacology + OPT III Optometric Case III; OPT II clinic block not included',
		academicEstimate: 56,
		clinicSources: 'CL OS4 4 + NVR OS4 3',
		clinicEstimate: '7',
		totalMin: 63,
		totalMax: 63
	},
	{
		day: 'Wednesday',
		time: '2 PM',
		academicSources: 'None counted; OPT II clinic block not included',
		academicEstimate: 0,
		clinicSources: 'CL OS4 4 + NVR OS4 3',
		clinicEstimate: '7',
		totalMin: 7,
		totalMax: 7
	},
	{
		day: 'Wednesday',
		time: '3 PM',
		academicSources: 'OPT I Neuro',
		academicEstimate: 28,
		clinicSources: 'CL OS4 4 + NVR OS4 3',
		clinicEstimate: '7',
		totalMin: 35,
		totalMax: 35
	},
	{
		day: 'Thursday',
		time: '8 AM',
		academicSources: 'OPT II Ophthalmic/Vision Science Labs I + OPT III Strab/Amblyopia Lab 1',
		academicEstimate: 56,
		clinicSources: 'No counted NSU clinic assignment',
		clinicEstimate: '0',
		totalMin: 56,
		totalMax: 56
	},
	{
		day: 'Thursday',
		time: '9 AM',
		academicSources: 'OPT II Ocular Disease II',
		academicEstimate: 28,
		clinicSources: 'No counted NSU clinic assignment',
		clinicEstimate: '0',
		totalMin: 28,
		totalMax: 28
	},
	{
		day: 'Thursday',
		time: '10 AM',
		academicSources: 'OPT I Ocular Anatomy + OPT II Ophthalmic/Vision Science Labs II + OPT III Strab/Amblyopia Lab 2',
		academicEstimate: 84,
		clinicSources: 'No counted NSU clinic assignment',
		clinicEstimate: '0',
		totalMin: 84,
		totalMax: 84
	},
	{
		day: 'Thursday',
		time: '11 AM',
		academicSources: 'OPT I Vision Science I + OPT II Ocular Pharmacology',
		academicEstimate: 56,
		clinicSources: 'No counted NSU clinic assignment',
		clinicEstimate: '0',
		totalMin: 56,
		totalMax: 56
	},
	{
		day: 'Thursday',
		time: '1 PM',
		academicSources: 'OPT I Methods II + OPT III Practice Development I; OPT II clinic block not included',
		academicEstimate: 56,
		clinicSources: 'VT 3 + CL 4 + Primary Care OS2 3',
		clinicEstimate: '10',
		totalMin: 66,
		totalMax: 66
	},
	{
		day: 'Thursday',
		time: '2 PM',
		academicSources: 'OPT I General Pathology',
		academicEstimate: 28,
		clinicSources: 'VT 3 + CL 4 + Primary Care OS2 3',
		clinicEstimate: '10',
		totalMin: 38,
		totalMax: 38
	},
	{
		day: 'Thursday',
		time: '3 PM',
		academicSources: 'OPT I Neuro',
		academicEstimate: 28,
		clinicSources: 'VT 3 + CL 4 + Primary Care OS2 3',
		clinicEstimate: '10',
		totalMin: 38,
		totalMax: 38
	},
	{
		day: 'Friday',
		time: '8 AM',
		academicSources: 'OPT I Screening/Chart Review/Observation; OPT III clinic block not included',
		academicEstimate: 28,
		clinicSources: 'CL OS4/Residents 4 confirmed NSU',
		clinicEstimate: '4',
		totalMin: 32,
		totalMax: 32
	},
	{
		day: 'Friday',
		time: '9 AM',
		academicSources: 'None counted',
		academicEstimate: 0,
		clinicSources: 'CL OS4/Residents 4 confirmed NSU',
		clinicEstimate: '4',
		totalMin: 4,
		totalMax: 4
	},
	{
		day: 'Friday',
		time: '10 AM',
		academicSources: 'OPT II Vision Science III',
		academicEstimate: 28,
		clinicSources: 'CL OS4/Residents 4 confirmed NSU',
		clinicEstimate: '4',
		totalMin: 32,
		totalMax: 32
	},
	{
		day: 'Friday',
		time: '11 AM',
		academicSources: 'None counted',
		academicEstimate: 0,
		clinicSources: 'CL OS4/Residents 4 confirmed NSU',
		clinicEstimate: '4',
		totalMin: 4,
		totalMax: 4
	},
	{
		day: 'Friday',
		time: '1 PM',
		academicSources: 'OPT I Ocular Anatomy; OPT II/III clinic blocks not included',
		academicEstimate: 28,
		clinicSources: 'Primary Care OS2 3 + CL OS3/Resident 8-9',
		clinicEstimate: '11-12',
		totalMin: 39,
		totalMax: 40
	},
	{
		day: 'Friday',
		time: '2 PM',
		academicSources: 'OPT I General Pathology',
		academicEstimate: 28,
		clinicSources: 'Primary Care OS2 3 + CL OS3/Resident 8-9',
		clinicEstimate: '11-12',
		totalMin: 39,
		totalMax: 40
	},
	{
		day: 'Friday',
		time: '3 PM',
		academicSources: 'None counted',
		academicEstimate: 0,
		clinicSources: 'Primary Care OS2 3 + CL OS3/Resident 8-9',
		clinicEstimate: '11-12',
		totalMin: 11,
		totalMax: 12
	}
];

export function demandLabel(point: ParkingDemandPoint) {
	return point.totalMin === point.totalMax ? `${point.totalMax}` : `${point.totalMin}-${point.totalMax}`;
}
