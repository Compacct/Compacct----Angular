export const environment = {
  production: true,
  accountName : "onlineexamprog",
  containerName:"ocpl",
   key:"SaiDdt4xdI6WFq9E5+8eE+GhpTIfDJpnpaFlk8VsZih/zINPEEr+UTAMuwJVflqzOUlqRJ6adH/xIZqfRe+o/g==",
  baseUrl: 'https://onlineexamprog.blob.core.windows.net/ocpl?',
  sas : 'st=2020-06-26T05%3A16%3A05Z&se=2030-06-27T05%3A16%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=p2mHCdg5yrs7kcls0DCVvwbkPNMEjsiVQZ2LhAInw6M%3D&=SaiDdt4xdI6WFq9E5+8eE+GhpTIfDJpnpaFlk8VsZih/zINPEEr+UTAMuwJVflqzOUlqRJ6adH/xIZqfRe+o/g=='
};
export const API = {
  userLogin: `${environment.baseUrl}/authentication_user`
};
