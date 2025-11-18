INSERT INTO users (email, display_name, password_hash, role, platform, platform_handle, profile_image_url)
VALUES (
    'admin@fcclubs.local',
    'FC Clubs Admin',
    '$2b$12$v5JJpO0DG.YmHRnBnY3CQ.6Sd2tOB/gwbIqxLN9MiOFU773PjayEK',
    'ADMIN',
    'EA',
    'fcclubs-admin',
    NULL
)
ON CONFLICT (email) DO NOTHING;
