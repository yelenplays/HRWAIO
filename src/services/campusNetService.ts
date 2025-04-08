import axios from 'axios';

interface Module {
  name: string;
  credits: number;
  grade?: number;
  status: 'completed' | 'pending' | 'in_progress';
}

interface UniversityData {
  totalCredits: number;
  gpa: number;
  modules: Module[];
}

class CampusNetService {
  private baseUrl = 'https://campusnet.hs-ruhrwest.de/scripts/mgrqispi.dll';
  private dsfLoginUrl = 'https://dsf.hs-ruhrwest.de/IdentityServer/Account/Login';
  private sessionId: string | null = null;
  private axiosInstance = axios.create({
    withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });

  async login(username: string, password: string): Promise<boolean> {
    try {
      // First, get the DSF login page to obtain any necessary tokens
      const loginPageResponse = await this.axiosInstance.get(this.dsfLoginUrl, {
        params: {
          ReturnUrl: '/IdentityServer/connect/authorize/callback?client_id=ClassicWeb&scope=openid%20DSF&response_mode=query&response_type=code&redirect_uri=https%3A%2F%2Fcampusnet.hs-ruhrwest.de%2Fscripts%2Fmgrqispi.dll%3FAPPNAME%3DCampusNet%26PRGNAME%3DLOGINCHECK%26ARGUMENTS%3D-N000000000000001,ids_mode&ids_mode=Y'
        }
      });

      // Extract any necessary tokens from the login page
      // This might include anti-forgery tokens or other security measures
      const tokens = this.extractTokens(loginPageResponse.data);

      // Perform the actual login through DSF
      const loginResponse = await this.axiosInstance.post(this.dsfLoginUrl, 
        new URLSearchParams({
          ...tokens,
          username: username,
          password: password,
          rememberLogin: 'true'
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          maxRedirects: 5,
          validateStatus: (status) => status >= 200 && status < 400
        }
      );

      // After successful DSF login, we should be redirected to CampusNet
      // Extract the session ID from the cookies
      const cookies = loginResponse.headers['set-cookie'];
      if (cookies) {
        const sessionCookie = cookies.find(cookie => cookie.includes('JSESSIONID'));
        if (sessionCookie) {
          this.sessionId = sessionCookie.split(';')[0].split('=')[1];
        }
      }

      // Verify we're properly logged in by checking CampusNet
      const campusNetCheck = await this.axiosInstance.get(this.baseUrl, {
        params: {
          APPNAME: 'CampusNet',
          PRGNAME: 'LOGINCHECK',
          ARGUMENTS: '-N000000000000001,-N000000000000000,-N000000000000000,-N000000000000000,-N000000000000000,-N000000000000000,-N000000000000000,-N000000000000000'
        }
      });

      return campusNetCheck.data.includes('LOGOUT') || campusNetCheck.data.includes('Abmelden');
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  private extractTokens(htmlContent: string): Record<string, string> {
    const tokens: Record<string, string> = {};
    
    // Extract anti-forgery token if present
    const antiForgeryMatch = htmlContent.match(/name="__RequestVerificationToken" value="([^"]+)"/);
    if (antiForgeryMatch) {
      tokens['__RequestVerificationToken'] = antiForgeryMatch[1];
    }

    // Extract any other necessary tokens from the form
    // Add more token extraction logic as needed

    return tokens;
  }

  async fetchUniversityData(): Promise<UniversityData> {
    if (!this.sessionId) {
      throw new Error('Not logged in');
    }

    try {
      const response = await this.axiosInstance.get(this.baseUrl, {
        params: {
          APPNAME: 'CampusNet',
          PRGNAME: 'STUDENT_RESULT',
          ARGUMENTS: '-N160603918757726,-N000407,-N0,-N000000000000000,-N000000000000000,-N000000000000000,-N0,-N000000000000000'
        }
      });

      // TODO: Parse the HTML response and extract the relevant data
      // This will need to be implemented based on the actual response structure
      
      return {
        totalCredits: 0,
        gpa: 0,
        modules: []
      };
    } catch (error) {
      console.error('Failed to fetch university data:', error);
      throw error;
    }
  }

  logout(): void {
    this.sessionId = null;
  }
}

export const campusNetService = new CampusNetService(); 