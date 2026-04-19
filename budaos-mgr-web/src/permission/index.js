import store from '@/store'

/**
 * 判断用户是否拥有操作权限
 * 根据传入的权限标识，查看是否存在用户权限标识集合
 * @param perms
 */
export function hasPermission(perms) {
  let hasPermission = false
  const permissions = store.state.user.perms
  if (!permissions || !permissions.length) {
    return false
  }
  for (let i = 0, len = permissions.length; i < len; i++) {
    if (permissions[i] === perms) {
      hasPermission = true
      break
    }
  }
  return hasPermission
}

export function hasPermissionList(permList) {
  let hasPermission = false
  const permissions = store.state.user.perms
  if (!permissions || !permissions.length) {
    return false
  }
  for (let i = 0, len = permissions.length; i < len; i++) {
    for (let j = 0, len2 = permList.length; j < len2; j++) {
      if (permissions[i] === permList[j]) {
        hasPermission = true
        break
      }
    }
  }
  return hasPermission
}
