import { OUTREACH_TEMPLATES } from '../src/data/outreachTemplates';

describe('outreach templates budget checks', () => {
  it('enforces linkedin note stays under 300 characters', () => {
    const tmpl = OUTREACH_TEMPLATES.find(t => t.id === 'linkedin-connect');
    const output = tmpl.generate({
      founderName: 'Alexander Hamilton',
      company: 'Bank of New York',
      organizationName: 'Global Conclave',
      topic: 'Financial Systems'
    });
    expect(output.length).toBeLessThanOrEqual(300);
  });
});
