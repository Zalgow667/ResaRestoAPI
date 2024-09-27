import vine from '@vinejs/vine';
export const serviceValidator = vine.compile(vine.object({
    day: vine.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    name: vine.string(),
}));
//# sourceMappingURL=service.js.map