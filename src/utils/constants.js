import settings from '@/settings'

export const JUDGE_STATUS = {
  '-1': {
    name: 'Not Submitted',
    short: 'NS',
    color: 'gray',
    type: 'info',
    rgb: '#909399'
  },
  '0': {
    name: 'Pending',
    color: 'grey',
    type: 'info',
    rgb: '#f90'
  },
  '1': {
    name: 'Accepted',
    short: 'AC',
    color: 'green',
    type: 'success',
    rgb: '#19be6b'
  },
  '2': {
    name: 'Wrong Answer',
    short: 'WA',
    color: 'red',
    type: 'danger',
    rgb: '#ed3f14'
  },
  '3': {
    name: 'Compile Error',
    short: 'CE',
    color: 'red',
    type: 'danger',
    rgb: '#f90'
  },
  '4': {
    name: 'Runtime Error',
    short: 'RE',
    color: 'red',
    type: 'danger',
    rgb: '#ed3f14'
  },
  '5': {
    name: 'Time Limit Exceeded',
    short: 'TLE',
    color: 'red',
    type: 'danger',
    rgb: '#ed3f14'
  },
  '6': {
    name: 'Memory Limit Exceeded',
    short: 'MLE',
    color: 'red',
    type: 'danger',
    rgb: '#ed3f14'
  },
  '7': {
    name: 'Output Limit Exceeded',
    short: 'OLE',
    color: 'red',
    type: 'error',
    rgb: '#ed3f14'
  },
  '8': {
    name: 'Presentation Error',
    short: 'PE',
    color: 'red',
    type: 'danger',
    rgb: '#f90'
  },
  '9': {
    name: 'System Error',
    short: 'SE',
    color: 'red',
    type: 'danger',
    rgb: '#909399'
  },
  '10': {
    name: 'Running',
    color: 'Darkorange',
    type: 'warning',
    rgb: '#f90'
  },
  '11': {
    name: 'Submitted Failed',
    color: 'Darkorange',
    short: 'SF',
    type: 'warning',
    rgb: '#909399'
  },
  '12': {
    name: 'Judging',
    color: 'grey',
    type: 'info',
    rgb: '#2d8cf0'
  },
  '13': {
    name: 'Score',
    short: 'SC',
    color: 'Darkorange',
    type: 'warning',
    rgb: '#f90'
  }
}

export const LANGUAGE = {
  '1': 'C/C++',
  '2': 'Java',
  '3': 'Python'
}

export const JUDGE_STATUS_RESERVE = {
  pending: 0,
  ac: 1,
  wa: 2,
  ce: 3,
  re: 4,
  tle: 5,
  mle: 6,
  ole: 7,
  pe: 8,
  system_error: 9,
  running: 10,
  error: 11,
  judging: 12,
  sc: 13
}

export const PROBLEM_LEVEL = {
  '1': {
    name: '简单',
    color: 'green',
    type: 'success'
  },
  '2': {
    name: '中等',
    color: 'blue',
    type: 'warning'
  },
  '3': {
    name: '困难',
    color: 'red',
    type: 'danger'
  }
}

// 比赛状态
export const CONTEST_STATUS_REVERSE = {
  '-1': {
    name: '未开始',
    color: '#f90'
  },
  '0': {
    name: '进行中',
    color: '#19be6b'
  },
  '1': {
    name: '已结束',
    color: '#ed3f14'
  }
}

export const CONTEST_STATUS = {
  'SCHEDULED': -1,
  'RUNNING': 0,
  'ENDED': 1
}

export const CONTEST_TYPE = {
  'GENERAL': 0,
  'RATING': 1
}

export const CONTEST_TYPE_REVERSE = {
  '0': {
    name: '普通比赛',
    tips: '所有用户都可参加，不计Rating分数'
  },
  '1': {
    name: 'Rating比赛',
    tips: '所有用户都可参加，计Rating分数'
  }
}

export const CONTEST_AUTH_REVERSE = {
  '0': {
    name: '公开赛',
    color: 'success',
    tips: '公开赛，每个用户都可查看与提交',
    submit: true, // 公开赛可看可提交
    look: true
  },
  '1': {
    name: '私有赛',
    color: 'danger',
    tips: '私有赛，需要密码才可查看与提交',
    submit: false, // 私有赛 必须要密码才能看和提交
    look: false
  }
}

export const CONTEST_AUTH = {
  PUBLIC: 0,
  PRIVATE: 1
}

export const RATING_LEVEL_REVERSE = {
  '0': {
    color: '#cccccc'
  },
  '1': {
    color: '#77ff77'
  },
  '2': {
    color: '#77ddbb'
  },
  '3': {
    color: '#aaaaff'
  },
  '4': {
    color: '#ff88ff'
  },
  '5': {
    color: '#ff9c42'
  },
  '6': {
    color: '#fc3a2d'
  }
}

export const RATING_LEVEL = {
  first: 0,
  second: 1,
  third: 2,
  fifth: 3,
  five: 4,
  sixth: 5,
  seventh: 6
}

export function generateCodeKey(pid, cid = 0) {
  return `${settings.storageKey.problemCode}_${cid}_${pid}`
}
