import { mockResponse } from '../mocks/mockResponse';
import { mockRequest } from '../mocks/mockRequest';
import { getStatus } from '../../src/controllers/status';

describe('getStatus', () => {
  it('should return an object with status information', async () => {
    // --- Assign

    // --- Act
    await getStatus(mockRequest, mockResponse);

    // --- Assert
    mockResponse
      .setHeader('Content-Type', 'application/json')
      .to.setHeader.toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockResponse.setHeader().toHaveBeenCalledWith('Content-Type', 'application/json'));
    expect(mockResponse.getHeader('API-Version')).toBe('1.0');
    expect(mockResponse.statusCode).toBe(200);
    expect(mockResponse.send).toHaveBeenCalledWith({});
  });
});
