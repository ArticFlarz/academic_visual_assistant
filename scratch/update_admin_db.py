import sqlite3

conn = sqlite3.connect('academic_system.db')
c = conn.cursor()
c.execute("UPDATE users SET full_name = 'System Administrator', usn = 'ADM-001' WHERE username = 'admin'")
conn.commit()
print("Updated admin user row count:", c.rowcount)

c.execute("SELECT id, username, email, full_name, usn, role FROM users WHERE username = 'admin'")
print("Admin user:", c.fetchone())
conn.close()
