import { getTimestampLabel } from './getTimestampLabel'

describe('getTimestampLabel', () => {
  test('Date.now returns correct timestamp', () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(123456)

    const result = getTimestampLabel()

    expect(nowSpy).toHaveBeenCalledTimes(1)
    expect(result).toBe('Timestamp: 123456')

    nowSpy.mockRestore()
  })
})
