export const notesSchema = {
  name: 'notes',
  properties: {
    id: { type: 'int', default: 0 },
    title: 'string',
    description: 'string'
  },
}