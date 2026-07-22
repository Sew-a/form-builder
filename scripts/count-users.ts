import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB, getDbInfo } from '../server/db/connect';
import { User } from '../server/db/models/User';

async function main() {
  await connectDB();
  const db = getDbInfo();
  const total = await User.countDocuments();
  const users = await User.find()
    .select('name email nickname createdAt')
    .sort({ createdAt: -1 })
    .lean();

  console.log(
    JSON.stringify(
      {
        totalRegisteredUsers: total,
        database: db,
        note: 'Sign-in uses stateless JWT cookies. This count is registered accounts in MongoDB, not browsers currently logged in.',
        users: users.map((u) => ({
          id: String(u._id),
          name: u.name,
          email: u.email,
          nickname: u.nickname ?? null,
          createdAt: u.createdAt,
        })),
      },
      null,
      2,
    ),
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
