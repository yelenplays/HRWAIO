import { UserData } from './firebaseService';

export interface ParsedModule {
  code: string;
  name: string;
  credits: number;
  grade?: string;
  status: 'passed' | 'incomplete' | 'open';
}

export interface ParsedUniversityData {
  program: string;
  totalCredits: number;
  requiredCredits: number;
  gpa: number;
  majorGpa: number;
  modules: ParsedModule[];
}

export const campusNetParser = {
  parseHtml(html: string): ParsedUniversityData {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract program name
    const programElement = doc.querySelector('.tbhead');
    const program = programElement?.textContent?.trim() || '';

    // Extract GPAs
    const gpaElements = doc.querySelectorAll('.tbsubhead');
    let gpa = 0;
    let majorGpa = 0;
    gpaElements.forEach(el => {
      const text = el.textContent || '';
      if (text.includes('Gesamt-GPA')) {
        gpa = parseFloat(text.split(' ').pop() || '0');
      } else if (text.includes('Hauptfach-GPA')) {
        majorGpa = parseFloat(text.split(' ').pop() || '0');
      }
    });

    // Extract credits
    const creditsElement = doc.querySelector('.level00');
    const creditsMatch = creditsElement?.textContent?.match(/(\d+),0/) || ['0'];
    const totalCredits = parseFloat(creditsMatch[1]);
    
    const requiredCreditsMatch = doc.querySelector('.level00')?.textContent?.match(/Erforderliche Credits für Abschluss: (\d+),0/) || ['0'];
    const requiredCredits = parseFloat(requiredCreditsMatch[1]);

    // Extract modules
    const modules: ParsedModule[] = [];
    const moduleRows = doc.querySelectorAll('table.nb.list.students_results tbody tr');
    
    moduleRows.forEach(row => {
      const codeCell = row.querySelector('td.tbdata');
      const nameCell = row.querySelector('td.tbdata:nth-child(2)');
      const creditsCell = row.querySelector('td.tbdata:nth-child(4)');
      const gradeCell = row.querySelector('td.tbdata:nth-child(5)');
      const statusCell = row.querySelector('td.tbdata:nth-child(6) img');

      if (codeCell && nameCell && !codeCell.textContent?.includes('Summe')) {
        const code = codeCell.textContent?.trim() || '';
        const name = nameCell.textContent?.trim() || '';
        const credits = parseFloat(creditsCell?.textContent?.trim() || '0');
        const grade = gradeCell?.textContent?.trim();
        
        let status: 'passed' | 'incomplete' | 'open' = 'open';
        if (statusCell) {
          const alt = statusCell.getAttribute('alt') || '';
          if (alt.includes('Bestanden')) status = 'passed';
          else if (alt.includes('Offen')) status = 'incomplete';
        }

        modules.push({
          code,
          name,
          credits,
          grade: grade || undefined,
          status
        });
      }
    });

    return {
      program,
      totalCredits,
      requiredCredits,
      gpa,
      majorGpa,
      modules
    };
  }
}; 