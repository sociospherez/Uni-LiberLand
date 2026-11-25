import test from 'node:test';
import assert from 'node:assert/strict';
import {courseDestination, enrolmentUrl, paymentReturnUrl, isLearningRoute} from '../public/enrolment-journey.js';

const course = {slug: 'social-media', available: 1};
const student = {role: 'student'};
const base = {course, user: student, paymentsReady: true};

test('Course journey retains the chosen course without offering duplicate payment or paused access', () => {
  assert.deepEqual(courseDestination({...base, user: null}), {state: 'account', href: enrolmentUrl(course.slug)});
  assert.equal(courseDestination(base).href, '/checkout.html?course=social-media');
  assert.equal(courseDestination({...base, enrolments: [{course: course.slug, status: 'pending'}]}).state, 'checkout');
  assert.equal(courseDestination({...base, payments: [{course: course.slug, status: 'open'}]}).state, 'checkout');
  assert.equal(courseDestination({...base, payments: [{course: course.slug, status: 'failed'}]}).state, 'checkout');
  for (const status of ['pending', 'paid']) {
    assert.deepEqual(courseDestination({...base, payments: [{course: course.slug, status}]}), {state: 'review', href: null});
  }
  assert.equal(courseDestination({...base, payments: [{course: 'excel', status: 'pending'}]}).state, 'checkout');
  assert.equal(courseDestination({...base, enrolments: [{course: course.slug, status: 'paused'}], payments: [{course: course.slug, status: 'paid'}]}).state, 'paused');
  assert.equal(courseDestination({...base, course: {...course, available: 0}, enrolments: [{course: course.slug, status: 'active'}]}).href, '/index.html?learn=social-media');
  assert.equal(courseDestination({...base, course: {...course, available: 0}}).state, 'unavailable');
  assert.equal(courseDestination({...base, user: {role: 'staff'}}).href, null);
  assert.equal(courseDestination({...base, paymentsReady: false}).state, 'manual');
  assert.equal(courseDestination({...base, course: {...course, available_lessons: 0}, enrolments: [{course: course.slug, status: 'active'}]}).state, 'enrolled');
  assert.equal(courseDestination({...base, course: null}).state, 'unknown');
});

test('Session recovery never accepts an arbitrary return URL and learning headers stay scoped to learning', () => {
  assert.equal(paymentReturnUrl('cs_test_abc123'), '/payment-return.html?session_id=cs_test_abc123');
  for (const input of ['https://untrusted.example', '//untrusted.example', 'cs_live_123', 'cs_test_abc&next=//untrusted.example', null]) assert.equal(paymentReturnUrl(input), null);
  assert.equal(enrolmentUrl('a&tab=profile'), '/portal.html?course=a%26tab%3Dprofile&intent=enrol');
  for (const route of ['learning-path', 'enrolled-lesson', 'social-assessment', 'social-quiz', 'social-certificate']) assert.equal(isLearningRoute(route), true);
  for (const route of ['home', 'programme', 'courses', 'dashboard']) assert.equal(isLearningRoute(route), false);
});
