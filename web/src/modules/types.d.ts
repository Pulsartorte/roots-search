declare type Page = {
  index: number
  title: string,
  component: JSX.Element,
  iconComponent: JSX.Element
  bossOnly?: boolean
  jobAccess?: boolean
}

declare type RequiredJob = {
  grade: number
  grade_label: string
  grade_name: string
  label: string
  name: string
  isBoss: boolean
}

declare type Field = {
  name: string
  value: string
}

declare type Item = {
  name: string; // VARCHAR(50) NOT NULL
  label: string; // VARCHAR(100) NOT NULL
  weight: number; // INT DEFAULT 0
  type: string; // VARCHAR(50) NOT NULL
  unique: boolean; // TINYINT(1) DEFAULT 0 (0 oder 1 wird als boolean interpretiert)
  useable: boolean; // TINYINT(1) DEFAULT 0 (0 oder 1 wird als boolean interpretiert)
  shouldClose: boolean; // TINYINT(1) DEFAULT 0 (0 oder 1 wird als boolean interpretiert)
  combinable?: string; // TEXT (Optional, da NULL erlaubt ist)
  description?: string; // TEXT (Optional, da NULL erlaubt ist)
  image?: string; // VARCHAR(100) (Optional, da NULL erlaubt ist)
  ammotype?: string;
}

declare type Job = {
  name: string; // VARCHAR(50) NOT NULL
  label: string; // VARCHAR(100) NOT NULL
  type: string; // VARCHAR(50) NOT NULL
  defaultDuty: boolean; // TINYINT(1) DEFAULT 0 (0 oder 1 wird als boolean interpretiert)
  offDutyPay: boolean; // TINYINT(1) DEFAULT 0 (0 oder 1 wird als boolean interpretiert)
  grades: Grade[]; // TINYINT(1) DEFAULT 0 (0 oder 1 wird als boolean interpretiert)
}

declare type Grade = {
  name: string;
  payment: number;
  isBoss: boolean;
}

declare type K5Document = {
  id?: string
  name: string
  customName?: string
  job?: string
  createdAt: string
  description: string
  fields: Field[]
  infoName: string
  infoValue: string
  isCopy: boolean
  issuer: {
    firstname: string
    lastname: string
    birthDate: string
    jobName: string
  }
}

type DocumentTemplate = {
  id?: string
  minGrade: number | null
  documentName: string
  documentDescription: string
  fields: Field[]
  infoName: string
  infoTemplate: string
}

type Texts = {
  [k: string]: string
}

type PlayerData = {
  firstname: string,
  lastname: string,
  dateofbirth: string,
  dateformat: string
}

type Player = {
  id: number,
  name: string,
  cid: string,
  citizenId: string
}