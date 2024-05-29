export const load = async ({ cookies }) => {
    const accessCookie = cookies.get('access');
    const user = accessCookie === 'true' ? { access: true } : { access: false };
    return {
      session: {
        user
      }
    };
  };
  