import UserPermission from "src/users/enums/user-permission.enum";
 
const Permission = {
  ...UserPermission
}
 
type Permission = UserPermission;
 
export default Permission;