RUN:
npm install
npm run dev

# 浏览器打开 http://localhost:5174

TEST:

打开浏览器控制台（F12），运行：

1.  HR 账号
    localStorage.setItem('authToken', 'mock-hr-token-12345');
    localStorage.setItem('testUser', JSON.stringify({
    id: 'hr-001',
    username: 'hr-admin',
    email: 'hr@company.com',
    isHr: true,
    stage: 'hr',
    status: 'active'
    }));
    console.log('HR 账号已设置！');
    window.location.href = '/hr/dashboard';

2.  测试 Employee 账号（从未提交）
    localStorage.setItem('authToken', 'mock-emp-token-12345');
    localStorage.setItem('testUser', JSON.stringify({
    id: 'emp-001',
    username: 'new.employee',
    email: 'newemployee@company.com',
    isHr: false,
    stage: 'onboarding',
    status: 'never_submit'
    }));
    console.log('Employee 账号已设置（从未提交）！');
    window.location.href = '/employee/onboarding';

3.  测试 Employee 账号（待审核）

localStorage.setItem('authToken', 'mock-emp-token-12345');
localStorage.setItem('testUser', JSON.stringify({
id: 'emp-002',
username: 'pending.emp',
email: 'pending@company.com',
isHr: false,
stage: 'onboarding',
status: 'pending',
feedback: null
}));
console.log('Employee 账号已设置（待审核）！');
window.location.href = '/employee/onboarding';

4. 测试 Employee 账号（已拒绝）

localStorage.setItem('authToken', 'mock-emp-token-12345');
localStorage.setItem('testUser', JSON.stringify({
id: 'emp-003',
username: 'rejected.emp',
email: 'rejected@company.com',
isHr: false,
stage: 'onboarding',
status: 'rejected',
feedback: 'Please provide valid SSN format and complete all required fields.'
}));
console.log('Employee 账号已设置（已拒绝）！');
window.location.href = '/employee/onboarding';

5. 测试 Employee 账号（已批准）

localStorage.setItem('authToken', 'mock-emp-token-12345');
localStorage.setItem('testUser', JSON.stringify({
id: 'emp-004',
username: 'approved.emp',
email: 'approved@company.com',
isHr: false,
stage: 'onboarding',
status: 'approved'
}));
console.log('Employee 账号已设置（已批准）！');
window.location.href = '/employee/dashboard';

MAIN PAGE

- 登录：`/login`
- 注册：`/register?token=Base64邮箱`
- 员工入职表单：`/employee/onboarding`
- 员工个人信息：`/employee/personal-info`
- HR 仪表盘：`/hr/dashboard`
- HR 员工列表：`/hr/employee-profiles`
- HR 员工详情：`/hr/employee-profile/:employeeId`
- HR 入职审核：`/hr/review-onboarding/:employeeId`

注:

- 真实环境需启动后端（默认 `http://localhost:3000`）。
- 未启动后端时，网络请求会提示“无法连接到服务器”，可用上面的本地模拟进行页面联调。
