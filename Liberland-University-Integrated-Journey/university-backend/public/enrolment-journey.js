// Navigation decisions only. The API remains authoritative for price and access.
export function enrolmentUrl(slug) {
  return '/portal.html?course=' + encodeURIComponent(slug) + '&intent=enrol';
}

export function courseDestination({course, user, enrolments = [], payments = [], paymentsReady = false}) {
  if (!course) return {state: 'unknown', href: null};
  if (!user) return {state: 'account', href: enrolmentUrl(course.slug)};
  if (user.role !== 'student') return {state: 'staff', href: null};
  const enrolment = enrolments.find(e => e.course === course.slug);
  if (enrolment?.status === 'active' && course.available_lessons === 0) return {state: 'enrolled', href: null};
  if (enrolment?.status === 'active') return {state: 'learning', href: '/index.html?learn=' + encodeURIComponent(course.slug)};
  if (enrolment?.status === 'paused') return {state: 'paused', href: null};
  if (payments.some(p => p.course === course.slug && ['paid', 'pending'].includes(p.status))) return {state: 'review', href: null};
  if (!course.available) return {state: 'unavailable', href: null};
  if (!paymentsReady) return {state: 'manual', href: null};
  return {state: 'checkout', href: '/checkout.html?course=' + encodeURIComponent(course.slug)};
}

export function paymentReturnUrl(session) {
  return /^cs_test_[A-Za-z0-9]+$/.test(session || '')
    ? '/payment-return.html?session_id=' + encodeURIComponent(session)
    : null;
}

export function isLearningRoute(route) {
  return ['learning-path', 'enrolled-lesson', 'social-assessment', 'social-quiz', 'social-certificate'].includes(route);
}
