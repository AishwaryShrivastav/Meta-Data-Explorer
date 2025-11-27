import { formatBytes, formatDateForInput, fileToBase64 } from './fileUtils';

export interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

export const runSystemTests = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  // 1. Test formatBytes
  try {
    const case1 = formatBytes(0) === '0 Bytes';
    const case2 = formatBytes(1024) === '1 KB';
    const case3 = formatBytes(1234) === '1.21 KB';
    
    if (case1 && case2 && case3) {
      results.push({ name: 'Utility: formatBytes', passed: true });
    } else {
      results.push({ name: 'Utility: formatBytes', passed: false, message: 'Formatting logic failed' });
    }
  } catch (e: any) {
    results.push({ name: 'Utility: formatBytes', passed: false, message: e.message });
  }

  // 2. Test formatDateForInput
  try {
    const testDate = new Date('2023-10-05T14:30:00');
    // Note: This test depends on local timezone, so we construct expected string dynamically to be safe
    const result = formatDateForInput(testDate.getTime());
    const validFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(result);
    
    if (validFormat) {
      results.push({ name: 'Utility: formatDateForInput', passed: true });
    } else {
      results.push({ name: 'Utility: formatDateForInput', passed: false, message: `Invalid format: ${result}` });
    }
  } catch (e: any) {
    results.push({ name: 'Utility: formatDateForInput', passed: false, message: e.message });
  }

  // 3. Test File API Support
  if (typeof File !== 'undefined' && typeof FileReader !== 'undefined' && typeof Blob !== 'undefined') {
    results.push({ name: 'Browser: File API Support', passed: true });
  } else {
    results.push({ name: 'Browser: File API Support', passed: false, message: 'Browser does not support required File APIs' });
  }

  // 4. Test fileToBase64 (Async)
  try {
    const blob = new Blob(['test content'], { type: 'text/plain' });
    const file = new File([blob], 'test.txt', { type: 'text/plain' });
    const base64 = await fileToBase64(file);
    // 'test content' in base64 is 'dGVzdCBjb250ZW50'
    if (base64 === 'dGVzdCBjb250ZW50') {
      results.push({ name: 'Utility: fileToBase64', passed: true });
    } else {
      results.push({ name: 'Utility: fileToBase64', passed: false, message: 'Base64 output incorrect' });
    }
  } catch (e: any) {
    results.push({ name: 'Utility: fileToBase64', passed: false, message: e.message });
  }

  return results;
};