/* eslint-disable */
import {brotliDecompressSync} from 'zlib';

export default brotliDecompressSync(
  Buffer.from(
    'G2YMAIzCcW8JiotDi8didqhbe5fpXptQ0sCPmE2vHiRXEy6IQY3NTkmXB/hDVOtymf/f2q+ahUINxAB33pvlzHwxj5jO7mKeTBOU4rn/GrFtONteFYJGEG1v7evQ80CkHxqYiZYLeeD0KVwqP77sRgRzradYIoWpJ1mOOybf6H0gasbF+StZBzU5N7oCXFVVnfZNKjl63pMVi4TGdRwaCVU9503L0CkePR33COCEoSdglxfgMMHk7l+drAm70gBgj3sPEuns5OUE3Jbd282WWRH70qMknNsWJzWu30yU2VlNV7hTvW7EzVHDIoGdI3pVbHTnFwWHgzkgLZzOeUlCaSnco94aJlrH1aypUglc04mh+Ipy2CDoPLNNGwcLFlwpBOyZuoY2Yd/F9WGIFQFQNL+9I9Zt/B9/JXejJPMrpewgbOZGSKfDTtpd5dAFQrIfh9WA2tb438vLiLpwlt8lyLj6xP+qLUed+sA5s3qHNIf6tdTB+GFJzmq+ZGppTLiNY2rFWFzB3xT/4uheSajIPnPc70a3N/pRz/zF4gBwic+MTneivyAw6OOHkMfSEzlo869uMsbQ7o6j7sPGAhaHSOFYzfhoZDtCJhFhEYpiNJLhvGmD/v/k6CR9eLcnJUk8XkAbu4gMHMHdSZkCbkT4BvwWAepyIaOTBY9PMwq8hXkKm7NIA6r8aqJeenfVW2MRpmtcwuip10Kzg06beo3azwitf7w3os/dFnp316f3yV1RhfPntonpHffE5Ew0EUMT0yEKz0Ebpd2a4NLRCOpJ37yUMj3/gobxT7nYiHcJBn/oW0XCmpl68ix3F1IVXZoV8AHetNJ25B/YF1YO3tMGQKq01/0rOU20QkS2cXstqYztcSl+qkxaSulwmTKK07ByphYomweuG7al9Josbc6rYDsTUenjmOoNNqX0tZ27qnoqgFejYgjO9AIOxCxSkSnGn5cJfRuZm09RqYTcGsz2mFQu8L4+kBNNzfOtMzuxuhDZEzrr/0hFlJgG2IH32COfuZit3UH/e3yrTh70evjvuz4d+T/LCbE63L3xjzTt0nJWrM2//xiM5iiYOB3BJ5cTfFq9qurjGYJv44WU3ZWfuzE6DUln1jfdoJcHjMhNiir2xYB03vfCE9zciNI55+GdLZxtKAkz0xhcq0SOW4lj65pKlotZtqO7kbXjjHrtP5ewAA==',
    'base64',
  ),
).toString();
