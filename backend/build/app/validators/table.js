import vine from '@vinejs/vine';
export const newTableValidator = vine.compile(vine.object({
    numero: vine.number(),
    capacity: vine.number(),
    id_plan: vine.number()
}));
//# sourceMappingURL=table.js.map