import { FC } from 'react';
import { OVERLAY_SERVER_URL, OVERLAY_DIMENSIONS } from '../../utils/constants';

export const MainPage: FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold mb-4 text-center text-falcons-primary">
          Welcome to the Falcons Esports Overlays Controller!
        </h1>

        <h2 className="text-2xl font-bold mt-8 mb-4">Instructions</h2>

        <ul className="space-y-3 text-lg">
          <li className="flex items-start gap-3">
            <span className="text-falcons-primary font-bold">•</span>
            <span>
              You can select overlays from the{' '}
              <a href="/files" className="text-blue-600 hover:text-blue-800 underline">
                Overlay Files
              </a>{' '}
              Page
            </span>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-falcons-primary font-bold">•</span>
            <span>
              The config can be modified from the{' '}
              <a href="/config" className="text-blue-600 hover:text-blue-800 underline">
                Config
              </a>{' '}
              Page
            </span>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-falcons-primary font-bold">•</span>
            <span>
              Turn on the overlay server from the{' '}
              <a href="/server" className="text-blue-600 hover:text-blue-800 underline">
                Server
              </a>{' '}
              Page
            </span>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-falcons-primary font-bold">•</span>
            <span>
              Control the overlays from the{' '}
              <a href="/controls" className="text-blue-600 hover:text-blue-800 underline">
                Control
              </a>{' '}
              Page
            </span>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-falcons-primary font-bold">•</span>
            <span>
              Make sure to add the overlay as a browser in OBS, it can also be set from the{' '}
              <a href="/config" className="text-blue-600 hover:text-blue-800 underline">
                Config
              </a>{' '}
              Page using the Inject button
            </span>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-falcons-primary font-bold">•</span>
            <span>
              The URL is{' '}
              <a href={OVERLAY_SERVER_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                {OVERLAY_SERVER_URL}
              </a>{' '}
              and the dimensions are {OVERLAY_DIMENSIONS.width}x{OVERLAY_DIMENSIONS.height}
            </span>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-falcons-primary font-bold">•</span>
            <span>
              You can change the Falcon logo by going to the{' '}
              <a href="/config" className="text-blue-600 hover:text-blue-800 underline">
                Config
              </a>{' '}
              Page and pressing the image button
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
