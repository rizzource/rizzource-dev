import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

// ----------------------------------- 
// CONFIG
// ----------------------------------- 
import { identifyUser, track } from "@/lib/analytics";
import { useEffect } from "react";

const BASE_URL = "https://devrizzource-gnacdydxc8dhakdh.canadacentral-01.azurewebsites.net/api";
const SECRET_KEY = "33Browntrucks!@#";

// ----------------------------------- 
// ENCRYPTION HELPERS
// ----------------------------------- 
const encrypt = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decrypt = (cipher) => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
        return null;
    }
};

// ----------------------------------- 
// RESTORED SESSION
// ----------------------------------- 
const storedSession = localStorage.getItem("rizzource_session");
const restored = storedSession ? decrypt(storedSession) : null;

// ----------------------------------- 
// USER AUTHENTICATION THUNKS
// ----------------------------------- 

// LOGIN USER
export const loginUser = createAsyncThunk(
    "user/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${BASE_URL}/users/login`, {
                email,
                password,
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

// REGISTER USER
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async ({ full_name, email, password }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${BASE_URL}/users/login`, {
                full_name,
                email,
                password,
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Registration failed");
        }
    }
);

// GOOGLE LOGIN
export const googleLogin = createAsyncThunk(
    "user/googleCodeLogin",
    async ({ code }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${BASE_URL}/users/google-code-login`, {
                code,
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Google login failed"
            );
        }
    }
);

// GET USER BY ID
export const getUserById = createAsyncThunk(
    "user/getUserById",
    async ({ user_id }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${BASE_URL}/users/${user_id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
        }
    }
);

// SUBMIT USER FEEDBACK
export const submitFeedbackThunk = createAsyncThunk(
    "user/submitFeedback",
    async ({ userId, feedbackType, userFeedback }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/users/userfeedback`, {
                userId,
                feedbackType,
                userFeedback,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// ----------------------------------- 
// SCRAPING THUNKS
// ----------------------------------- 

// GET JOBS (SCRAPING ENDPOINT)
export const getJobs = createAsyncThunk(
    "scraping/getJobs",
    async ({ page = 1, page_size = 9, state, practice_area, year_eligibility, sort_by = "newest" } = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("page_size", page_size);
            if (state) params.append("state", state);
            if (practice_area) params.append("practice_area", practice_area);
            if (year_eligibility) params.append("year_eligibility", year_eligibility);
            params.append("sort_by", sort_by);

            const res = await axios.get(`${BASE_URL}/scraping/jobs?${params.toString()}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch jobs");
        }
    }
);

// TRIGGER SCRAPING JOB
export const triggerScrapingJob = createAsyncThunk(
    "scraping/trigger",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${BASE_URL}/scraping/trigger`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to trigger scraping");
        }
    }
);

// ----------------------------------- 
// RESUME & AI THUNKS
// ----------------------------------- 

// UPLOAD RESUME
export const fileUpload = createAsyncThunk(
    "resume/upload",
    async ({ file }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post(`${BASE_URL}/resume/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "File upload failed");
        }
    }
);

// GENERATE BULLETS
export const generateBulletsThunk = createAsyncThunk(
    "resume/generateBullets",
    async ({ role, description }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${BASE_URL}/resume/generate-bullets`, {
                role,
                description,
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to generate bullets"
            );
        }
    }
);

// GENERATE COVER LETTER
export const generateCoverLetterThunk = createAsyncThunk(
    "resume/generateCoverLetter",
    async ({ resume_text, job_description, job_title = "Applicant", company = "Company", tone = "Professional" }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${BASE_URL}/resume/generate-cover-letter`, {
                resume_text,
                job_description,
                job_title,
                company,
                tone,
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to generate cover letter"
            );
        }
    }
);

// REGENERATE COVER LETTER
export const reGenerateCoverLetterThunk = createAsyncThunk(
    "resume/regenerateCoverLetter",
    async ({ resume_text, job_description, job_title = "Applicant", company = "Company", tone = "Professional" }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${BASE_URL}/resume/regenerate-cover-letter`, {
                resume_text,
                job_description,
                job_title,
                company,
                tone,
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to regenerate cover letter"
            );
        }
    }
);

// IMPROVE BULLET
export const improveBulletThunk = createAsyncThunk(
    "resume/improveBullet",
    async ({ bullet_text, job_title }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${BASE_URL}/resume/improve-bullet`, {
                bullet_text,
                job_title,
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to improve bullet"
            );
        }
    }
);

// GENERATE NEW BULLET
export const generateNewBulletThunk = createAsyncThunk(
    "resume/generateNewBullet",
    async ({ job_title, company }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${BASE_URL}/resume/generate-new-bullet`, {
                job_title,
                company,
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to generate new bullet"
            );
        }
    }
);

// REWRITE CV
export const rewriteResumeThunk = createAsyncThunk(
    "resume/rewrite",
    async ({ resume_text, job_description }, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${BASE_URL}/resume/rewrite`, {
                resume_text,
                job_description,
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to rewrite resume"
            );
        }
    }
);

// ----------------------------------- 
// PDF EXPORT THUNKS
// ----------------------------------- 

// EXPORT PDF (RAW HTML)
export const exportPdfThunk = createAsyncThunk(
    "pdf/export",
    async ({ html, fileName = "resume" }, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${BASE_URL}/pdf/export`,
                { html, fileName },
                {
                    responseType: "blob",
                }
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to export PDF"
            );
        }
    }
);

// EXPORT RESUME AS PDF (STRUCTURED JSON)
export const exportResumePdfThunk = createAsyncThunk(
    "pdf/resumeExport",
    async (
        {
            personalInfo,
            summary,
            experience,
            education,
            skills,
            fileName = "resume",
        },
        { rejectWithValue }
    ) => {
        try {
            const res = await axios.post(
                `${BASE_URL}/pdf/resume-export`,
                {
                    personalInfo,
                    summary,
                    experience,
                    education,
                    skills,
                    fileName,
                },
                {
                    responseType: "blob",
                }
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to export resume PDF"
            );
        }
    }
);

// ----------------------------------- 
// INITIAL STATE
// ----------------------------------- 
const initialState = {
    loading: false,
    error: null,
    token: restored?.token || null,
    user: restored?.user || null,
    roles: restored?.roles || [],

    // Scraping data
    jobs: [],
    totalJobs: 0,
    newJobs24h: 0,
    lastUpdated: null,
    currentPage: 1,
    pageSize: 9,
    scrapingResult: null,

    // Resume & AI
    tempResume: null,
    parsedResume: null,
    coverLetter: "",
    improvedBullets: [],
    newBullets: [],
    generatedBullets: [],
    rewrittenResume: null,

    // Selected data
    selectedJob: null,

    // PDF Export
    exportedPdf: null,
};

// ----------------------------------- 
// SLICE
// ----------------------------------- 
const userApiSlice = createSlice({
    name: "userApi",
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.user = null;
            state.roles = [];
            state.selectedJob = null;
            state.tempResume = null;
            state.parsedResume = null;
            state.jobs = [];
            localStorage.removeItem("rizzource_session");
        },
        setSelectedJob(state, action) {
            state.selectedJob = action.payload;
        },
        setTempResume(state, action) {
            state.tempResume = action.payload;
        },
        clearTempResume(state) {
            state.tempResume = null;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // --------- LOGIN USER ---------
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user || action.payload.data;
                state.roles = action.payload.roles || [];
                const encrypted = encrypt({
                    token: action.payload.token,
                    user: action.payload.user || action.payload.data,
                    roles: action.payload.roles || [],
                });
                localStorage.setItem("rizzource_session", encrypted);
                track("UserLoggedIn", {
                    userId: state.user?.id,
                    email: state.user?.email,
                    method: "manual",
                });
                identifyUser({
                    id: state.user?.id,
                    email: state.user?.email,
                    name: state.user?.full_name || state.user?.firstName + " " + state.user?.lastName,
                });
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- REGISTER USER ---------
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user || action.payload.data;
                state.roles = action.payload.roles || [];
                const encrypted = encrypt({
                    token: action.payload.token,
                    user: action.payload.user || action.payload.data,
                    roles: action.payload.roles || [],
                });
                localStorage.setItem("rizzource_session", encrypted);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- GOOGLE LOGIN ---------
        builder
            .addCase(googleLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user || action.payload.data;
                state.roles = action.payload.roles || [];
                const encrypted = encrypt({
                    token: action.payload.token,
                    user: action.payload.user || action.payload.data,
                    roles: action.payload.roles || [],
                });
                localStorage.setItem("rizzource_session", encrypted);
                track("UserLoggedIn", {
                    userId: state.user?.id,
                    email: state.user?.email,
                    method: "google",
                });
                identifyUser({
                    id: state.user?.id,
                    email: state.user?.email,
                    name: state.user?.full_name,
                });
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- GET USER BY ID ---------
        builder
            .addCase(getUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- SUBMIT FEEDBACK ---------
        builder
            .addCase(submitFeedbackThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitFeedbackThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(submitFeedbackThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- GET JOBS (SCRAPING) ---------
        builder
            .addCase(getJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload.data || [];
                state.totalJobs = action.payload.total_jobs || 0;
                state.newJobs24h = action.payload.new_jobs_24h || 0;
                state.lastUpdated = action.payload.last_updated;
                state.currentPage = action.payload.page || 1;
                state.pageSize = action.payload.page_size || 9;
            })
            .addCase(getJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- TRIGGER SCRAPING JOB ---------
        builder
            .addCase(triggerScrapingJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(triggerScrapingJob.fulfilled, (state, action) => {
                state.loading = false;
                state.scrapingResult = action.payload;
            })
            .addCase(triggerScrapingJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- FILE UPLOAD ---------
        builder
            .addCase(fileUpload.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fileUpload.fulfilled, (state, action) => {
                state.loading = false;
                state.parsedResume = action.payload.parsed_data || action.payload;
            })
            .addCase(fileUpload.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- GENERATE BULLETS ---------
        builder
            .addCase(generateBulletsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateBulletsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.generatedBullets = action.payload.bullets || [];
            })
            .addCase(generateBulletsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- GENERATE COVER LETTER ---------
        builder
            .addCase(generateCoverLetterThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateCoverLetterThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.coverLetter = action.payload.cover_letter || action.payload;
            })
            .addCase(generateCoverLetterThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- REGENERATE COVER LETTER ---------
        builder
            .addCase(reGenerateCoverLetterThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(reGenerateCoverLetterThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.coverLetter = action.payload.cover_letter || action.payload;
            })
            .addCase(reGenerateCoverLetterThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- IMPROVE BULLET ---------
        builder
            .addCase(improveBulletThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(improveBulletThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.improvedBullets = action.payload.improved_bullet ? [action.payload.improved_bullet] : [];
            })
            .addCase(improveBulletThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- GENERATE NEW BULLET ---------
        builder
            .addCase(generateNewBulletThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateNewBulletThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.newBullets = action.payload.bullet ? [action.payload.bullet] : [];
            })
            .addCase(generateNewBulletThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- REWRITE RESUME ---------
        builder
            .addCase(rewriteResumeThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rewriteResumeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.rewrittenResume = action.payload.rewritten_resume || action.payload;
            })
            .addCase(rewriteResumeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- EXPORT PDF ---------
        builder
            .addCase(exportPdfThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(exportPdfThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.exportedPdf = action.payload;
            })
            .addCase(exportPdfThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --------- EXPORT RESUME PDF ---------
        builder
            .addCase(exportResumePdfThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(exportResumePdfThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.exportedPdf = action.payload;
            })
            .addCase(exportResumePdfThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, setSelectedJob, setTempResume, clearTempResume, clearError } = userApiSlice.actions;
export default userApiSlice.reducer;