export default {
  name: 'arrival',
  title: 'Поступлення товарів',
  type: 'document',
  fields: [
    {
      name: 'date',
      title: 'Дата поступлення',
      type: 'date',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'productCount',
      title: 'Кількість товарів',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'products',
      title: 'ID товарів з Prom.ua',
      type: 'array',
      of: [{ type: 'number' }],
    },
  ],
  preview: {
    select: {
      date: 'date',
      count: 'productCount',
    },
    prepare(selection: { date: string; count: number }) {
      return {
        title: `Поступлення ${selection.date}`,
        subtitle: `${selection.count} товарів`,
      };
    },
  },
};
