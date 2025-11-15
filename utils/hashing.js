import bcrypt from "bcrypt";

export const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND));
  return await bcrypt.hash(plain, salt);
};

export const comparePassword = async (plain, hash) => {
  return await bcrypt.compare(plain, hash);
};
