interface Profile {
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  profile: string;
  userId: string;
  userName: string;
}
const createStateManager = () => {
  let accessToken: string | null = null;
  let profileData: null | Profile = null;
  return {
    setAccessTokenState(value: string | null) {
      accessToken = value;
    },
    getAccessTokenState() {
      return accessToken;
    },
    setProfileState(value: Profile | null) {
      profileData = value;
    },
    getProfileState() {
      return profileData;
    },
  };
};

const stateManager = createStateManager();
export default stateManager;
