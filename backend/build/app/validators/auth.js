import vine from '@vinejs/vine';
export const registerValidator = vine.compile(vine.object({
    email: vine
        .string()
        .email()
        .unique(async (db, value) => {
        const users = await db.from('users').select('id_user').where('email', value).first();
        return !users;
    }),
    password: vine.string().minLength(8).maxLength(32).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/),
    firstName: vine.string(),
    lastName: vine.string(),
}));
export const editValidator = vine.compile(vine.object({
    password: vine.string().minLength(8).maxLength(32).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/),
    firstName: vine.string(),
    lastName: vine.string(),
}));
export const loginValidator = vine.compile(vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/),
}));
//# sourceMappingURL=auth.js.map