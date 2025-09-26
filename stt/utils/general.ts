import fs from 'fs';
import fsExtra from 'fs-extra';
/**
 * Animates a message with hyphens in the terminal.
 *
 * @param message - The message to display along with animated hyphens.
 * @returns A function to stop the animation when invoked.
 *
 * @example
 * // Start animation
 * const stopAnimation = animateTerminalLoading('Watson STT working');
 *
 * // To stop the animation, call stopAnimation()
 * stopAnimation();
 */
export const animateTerminalLoading = (message: string) => {
  let hyphens = '-';
  let isAnimating = true;
  console.log(`\n${message}`);

  const interval = setInterval(() => {
    if (isAnimating) {
      hyphens += '-';
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(hyphens);

      if (hyphens.length === message.length) {
        hyphens = '-';
      }
    }
  }, 500);

  /**
   * Stops the animation.
   */
  function stopAnimation() {
    isAnimating = false;
    clearInterval(interval);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log('\n');
  }

  return stopAnimation;
};

/**
 * Rate-limits the execution of a batch of asynchronous functions.
 *
 * @param data - An array of functions that return promises to execute.
 * @param rateLimit - The number of functions to execute in parallel before applying rate limiting.
 * @param callback - A callback function to execute after all functions in the batch are completed.
 * @returns A promise that resolves when all functions have been executed and the callback is invoked.
 *
 * @example
 * // Define an array of functions that return promises
 * const asyncFunctions = [func1, func2, func3, ...];
 *
 * // Rate limit the execution of the functions with a limit of 5 at a time
 * rateLimiter(asyncFunctions, 5, () => {
 *   console.log('All functions executed.');
 * }).then(() => {
 *   console.log('Callback completed.');
 * });
 */
export async function rateLimiter(
  data: Array<() => Promise<void>>,
  rateLimit: number
): Promise<void> {
  for (let i = 0; i < data.length; i++) {
    if (i % rateLimit === 0 && i > 0) {
      console.log(`\nWaiting for rate limiting. Sleeping for a while...\n`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    await data[i]();
  }
}

/**
 * Backs up a specified file by copying it to a backup folder with a ".bak" extension.
 *
 * @param {string} fileName - The name of the file to be backed up.
 * @param {string} dir - The directory the file will be stored (e.g., "stt_data", "nlu_data", or "radar_data").
 * @param {string} backupDirName - The name of the backup folder within the specified data type.
 *
 * @throws {Error} Throws an error if there is an issue during the backup process.
 *
 * @example
 * // Example usage:
 * const fileName = 'file.txt';
 * const dir = 'stt_data';
 * const backupDirName = 'backup';
 * await backupFile(fileName, dir, backupDirName);
 */
export async function backupFile(
  fileName: string,
  dir: string,
  backupDirName: string
): Promise<void> {
  try {
    const filePath = `./${dir}/${fileName}`;

    const fileExists = await fs.promises
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      const backupFilePath = `./${dir}/${backupDirName}/${fileName}.bak`;

      await fsExtra.copyFile(filePath, backupFilePath);

      console.log(
        `File '${filePath}' exists, backup copied to '${backupFilePath}'`
      );
    } else {
      console.log(`File '${filePath}' does not exist, no backup created.`);
    }
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  }
}
