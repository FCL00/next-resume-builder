-- ==============================================================================
-- ResumAI Demo Account Provisioning (Development & Demo Seed)
-- ==============================================================================
-- Run this query in the Supabase SQL Editor if you want to enable a dedicated
-- demo account in your Supabase project:
-- Email: demo@resumai.com (or demo@resumai.example.com)
-- Password: DemoAccount2026!
-- ==============================================================================

DO $$
DECLARE
  demo_user_id UUID := 'd3b07384-d113-4a44-9c88-123456789abc'::uuid;
BEGIN
  -- 1. Insert demo user into auth.users if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email IN ('demo@resumai.com', 'demo@resumai.example.com')) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      demo_user_id,
      'authenticated',
      'authenticated',
      'demo@resumai.com',
      crypt('DemoAccount2026!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Demo Candidate"}',
      now(),
      now()
    );
  END IF;

  -- 2. Insert into public.profiles
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (demo_user_id, 'Demo Candidate', 'demo@resumai.com')
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = EXCLUDED.email;

  -- 3. Insert initial sample resume for the demo user if they don't have one
  IF NOT EXISTS (SELECT 1 FROM public.resumes WHERE user_id = demo_user_id) THEN
    INSERT INTO public.resumes (
      id,
      user_id,
      title,
      template_id,
      data,
      created_at,
      updated_at
    )
    VALUES (
      'a1b2c3d4-e5f6-4a1b-8c2d-9e0f1a2b3c4d'::uuid,
      demo_user_id,
      'Full Stack Engineer - Sample',
      'modern',
      '{
        "personalInfo": {
          "fullName": "Demo Candidate",
          "jobTitle": "Senior Full Stack Engineer",
          "email": "demo@resumai.com",
          "phone": "+1 (555) 234-5678",
          "city": "San Francisco",
          "country": "United States",
          "portfolio": "https://democandidate.dev"
        },
        "summary": "Versatile full stack developer with experience in TypeScript, React, Next.js, and cloud backends.",
        "experience": [
          {
            "id": "exp-1",
            "jobTitle": "Senior Software Engineer",
            "company": "TechFlow Systems",
            "employmentType": "Full-time",
            "location": "San Francisco, CA",
            "startDate": "2022-03",
            "endDate": "",
            "isCurrent": true,
            "description": "Architect core customer analytics SaaS dashboard.",
            "bulletPoints": [
              "Built high-performance streaming pipelines processing 10M daily events with 99.9% uptime.",
              "Mentored engineering teams on modern React and TypeScript best practices."
            ]
          }
        ],
        "education": [
          {
            "id": "edu-1",
            "school": "University of California, Berkeley",
            "degree": "Bachelor of Science",
            "fieldOfStudy": "Computer Science",
            "startDate": "2016-09",
            "endDate": "2020-05"
          }
        ],
        "skills": {
          "technical": ["TypeScript", "React", "Next.js", "PostgreSQL", "Node.js", "Tailwind CSS"],
          "soft": ["Team Leadership", "Problem Solving", "Agile Collaboration"],
          "other": ["Git", "Docker", "REST APIs"]
        },
        "projects": [],
        "certifications": [],
        "languages": [{"id": "lang-1", "language": "English", "proficiency": "Native"}],
        "volunteer": [],
        "awards": [],
        "customSections": [],
        "sectionVisibility": {
          "summary": true,
          "experience": true,
          "education": true,
          "skills": true,
          "projects": false,
          "certifications": false,
          "languages": true,
          "volunteer": false,
          "awards": false,
          "customSections": false
        },
        "sectionOrder": ["summary", "experience", "education", "skills", "projects", "certifications", "languages"],
        "customization": {
          "templateId": "modern",
          "accentColor": "#4f46e5",
          "fontPreset": "inter",
          "spacing": "normal",
          "showPhoto": false
        }
      }'::jsonb,
      now(),
      now()
    );
  END IF;
END $$;
