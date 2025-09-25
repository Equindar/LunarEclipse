interface Resources {
  admin: {
    dashboard: {
      title: 'Dashboard';
      navbar: {
        title: 'Navbar Title';
      };
      sidebar: {
        title: 'Sidebar Title';
      };
    };
  };
  common: {};
  dev: {
    home: {
      title: 'DEV-Area';
    };
  };
  main: {
    index: {
      'hero-section': {
        'title-1': 'Explore the magic world of Meridianis';
        'subtitle-1': 'Wander alone or together with other players the landscape, cross plains, crest mountains or explore dark forests.';
      };
    };
    navigation: {
      home: 'Home';
      review: 'Reviews';
      team: 'Team';
    };
    login: {
      title: 'Login';
      subtitle: 'Sign in and get started.';
      'form-email': 'Email';
      'form-password': 'Password';
    };
    registration: {
      title: 'Sign up';
      subtitle: 'Create your account.';
      'form-email': 'Email';
      'form-password': 'Password';
    };
  };
  translation: {
    title: 'LunarEclipse';
    welcome: 'Welcome to Next.js 13/14 <1>with the new app directory features</1> and i18next';
  };
}

export default Resources;
