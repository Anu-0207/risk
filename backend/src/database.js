import fs from 'fs';
import path from 'path';

// Persistent SQLite-compatible file-backed store for production & local development
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'riskvault.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        users: parsed.users || [],
        scans: parsed.scans || [],
      };
    }
  } catch (err) {
    console.error('Error reading database file, initializing fresh store:', err);
  }
  return { users: [], scans: [] };
}

function saveDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

let dbData = loadDatabase();

export const db = {
  // Users queries
  findUserByEmail: (email) => {
    return dbData.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById: (id) => {
    return dbData.users.find((u) => u.id === id) || null;
  },

  createUser: (user) => {
    dbData.users.push(user);
    saveDatabase(dbData);
    return user;
  },

  updateUser: (id, updates) => {
    const userIndex = dbData.users.findIndex((u) => u.id === id);
    if (userIndex !== -1) {
      dbData.users[userIndex] = { ...dbData.users[userIndex], ...updates };
      saveDatabase(dbData);
      return dbData.users[userIndex];
    }
    return null;
  },

  // Scans queries - strictly isolated by user_id
  createScan: (scan) => {
    dbData.scans.unshift(scan);
    saveDatabase(dbData);
    return scan;
  },

  getScansByUserId: (userId) => {
    return dbData.scans.filter((s) => s.user_id === userId);
  },

  getScanByIdAndUserId: (id, userId) => {
    return dbData.scans.find((s) => s.id === id && s.user_id === userId) || null;
  },

  deleteScanByIdAndUserId: (id, userId) => {
    const index = dbData.scans.findIndex((s) => s.id === id && s.user_id === userId);
    if (index !== -1) {
      const deleted = dbData.scans.splice(index, 1)[0];
      saveDatabase(dbData);
      return deleted;
    }
    return null;
  },

  updateScanRecommendations: (id, userId, recommendationId, resolved) => {
    const scan = dbData.scans.find((s) => s.id === id && s.user_id === userId);
    if (scan) {
      const rec = scan.recommendations.find((r) => r.id === recommendationId);
      if (rec) {
        rec.resolved = resolved;
        saveDatabase(dbData);
        return scan;
      }
    }
    return null;
  },

  updateScanThreatStatus: (id, userId, threatId, status) => {
    const scan = dbData.scans.find((s) => s.id === id && s.user_id === userId);
    if (scan) {
      const threat = scan.threats.find((t) => t.id === threatId);
      if (threat) {
        threat.status = status;
        saveDatabase(dbData);
        return scan;
      }
    }
    return null;
  },
};
