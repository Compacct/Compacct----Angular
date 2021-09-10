export const environment = {
  production: true,
  accountName : "onlineexamprog",
  containerName:"ocpl",
  sasGeneratorUrl: 'https://onlineexamprog.blob.core.windows.net/ocpl',
   key:"SaiDdt4xdI6WFq9E5+8eE+GhpTIfDJpnpaFlk8VsZih/zINPEEr+UTAMuwJVflqzOUlqRJ6adH/xIZqfRe+o/g==",
  baseUrl: 'https://onlineexamprog.blob.core.windows.net/ocpl',
  sas : 'st=2020-06-26T10%3A38%3A03Z&se=2030-06-27T10%3A38%3A00Z&sp=racwdl&sv=2018-03-28&sr=c&sig=E3AbEGQppMmhYtm0HqrSQwTidDTO09xG%2BAVspEqINjI%3D'
};
export const API = {
  userLogin: `${environment.baseUrl}/authentication_user`
};
